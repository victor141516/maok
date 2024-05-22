import { TreeNode, TreePath } from '@/libs/tree-path'
import { reactive } from 'vue'

export const state = reactive<{
  notesTree: TreeNode | null
  currentTreeNodePath: TreePath | null
}>({
  notesTree: null,
  currentTreeNodePath: null,
})
