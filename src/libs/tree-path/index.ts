import { set, get } from 'object-path'

export type TreeNode = {
  id: number
  text: string
  note?: string
  children?: Array<TreeNode>
}

export type TreeCommit = {
  path: string
  action: 'addAfter' | 'addBefore' | 'remove' | 'update'
  value?: string | number
}

export const BASE_PATH = '/b'

export class TreePath {
  pathElements!: Array<TreeNode>
  consumers: Array<TreePathConsumer> = []

  constructor(pathElementsStrings: string[], private parentNode: TreeNode) {
    this.initialize(pathElementsStrings)
  }

  initialize(pathElementsStrings: string[]) {
    const path = [...pathElementsStrings]
    const nodePath: Array<TreeNode> = [this.parentNode]
    while (path.length > 0) {
      const nextNodeId = Number.parseInt(path.shift()!)
      const nextElement = nodePath
        .at(-1)!
        .children!.find((e) => e.id === nextNodeId)
      if (!nextElement) {
        throw new Error(`Node with id ${nextNodeId} not found`)
      }
      nodePath.push(nextElement)
    }
    this.pathElements = nodePath
  }

  goBack() {
    return this.pathElements.pop()
  }

  toUrl() {
    return this.pathElements
      .slice(1, this.pathElements.length)
      .reduce((acc, e) => acc + '/' + e.id, BASE_PATH)
  }

  toJsonPath() {
    let path = '0'
    for (let i = 1; i < this.pathElements.length; i++) {
      const currentElement = this.pathElements[i - 1]
      const nextElement = this.pathElements[i]
      const index = currentElement.children!.indexOf(nextElement)
      path += '.children.' + index
    }
    return path
  }

  parent() {
    return new TreePath(
      this.pathElements
        .slice(1, this.pathElements.length - 1)
        .map((e) => e.id.toString()),
      this.parentNode
    )
  }

  currentNode() {
    return this.pathElements.at(-1)!
  }

  useConsumer(consumer: TreePathConsumer) {
    this.consumers.push(consumer)
  }

  commit(commit: TreeCommit) {
    this.consumers.forEach((consumer) => consumer.commit(commit))
  }
}

interface TreePathConsumer {
  commit(commit: TreeCommit): Promise<void>
  process(): Promise<void>
}

export class TreePathLocalConsumer implements TreePathConsumer {
  private commits: Array<TreeCommit> = []
  private waitForCommits!: Promise<void>
  private onNewCommits!: () => void

  constructor(private treePath: TreePath) {
    this.resetWaiter()
    ;(async () => {
      while (true) await this.process()
    })()
  }

  private resetWaiter() {
    this.waitForCommits = new Promise((resolve) => {
      this.onNewCommits = resolve
    })
  }

  async commit(commit: TreeCommit) {
    this.commits.push(commit)
    this.onNewCommits()
  }

  async process() {
    await this.waitForCommits
    while (this.commits.length > 0) {
      const commit = this.commits.shift()!
      switch (commit.action) {
        case 'addAfter':
          let parentNode = get(this.treePath.pathElements, commit.path) as
            | undefined
            | Array<TreeNode>
          let insertAfter = 0
          if (!parentNode) {
            // If node has no children, initialize children array and use insertAfter = 0
            // then get parentNode again
            set(this.treePath.pathElements, commit.path, [])!
            parentNode = get(
              this.treePath.pathElements,
              commit.path
            ) as Array<TreeNode>
          } else {
            // Is already has children, then find the index
            insertAfter =
              parentNode.findIndex((e) => e.id === commit.value) ?? 0
          }
          // if (insertAfter === -1)
          //   throw new Error(`Node with id ${commit.value} not found`)
          // const newChildren = [
          //   ...parentNode.slice(insertAfter + 1),
          //   {
          //     id: 9999, // TODO: generate id
          //     text: '',
          //   },
          //   ...parentNode.slice(insertAfter + 1),
          // ]
          // set(this.treePath.pathElements, commit.path, newChildren)
          parentNode.splice(insertAfter + 1, 0, {
            id: 10000 + Math.round(Math.random() * 1000000), // TODO: generate id
            text: '',
          })
          break
        case 'addBefore':
          // this.addNode(commit.path, commit.value)
          break
        case 'remove':
          // this.removeNode(commit.path)
          break
        case 'update':
          set(this.treePath.pathElements, commit.path, commit.value)
          break
      }
      this.resetWaiter()
    }
  }
}
