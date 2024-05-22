<script setup lang="ts">
import Children from '@/components/Children.vue'
import { TreeNode } from '@/libs/tree-path'
import { state } from '@/store/tree'
import { Icon } from '@iconify/vue'
import { ref } from 'vue'

defineProps<{
  node: TreeNode
}>()

const onChangeText = (event: Event) => {
  const target = event.target as HTMLElement
  state.currentTreeNodePath?.commit({
    action: 'update',
    path: state.currentTreeNodePath.toJsonPath() + '.text',
    value: target.innerText,
  })
}

const addLast = () => {
  state.currentTreeNodePath?.commit({
    action: 'addAfter',
    path: state.currentTreeNodePath!.toJsonPath() + '.children',
    value: state.currentTreeNodePath.pathElements.at(-1)?.children?.at(-1)?.id,
  })
  setTimeout(() => {
    ;(
      Array.from(childrenElement.value?.querySelectorAll('.node-text')!).at(
        -1
      ) as HTMLElement
    ).focus()
  }, 10)
}

const childrenElement = ref<null | HTMLElement>(null)
</script>

<template>
  <main class="px-3 py-2 flex flex-col gap-2">
    <h1
      contentEditable="true"
      class="cursor-text contentEditable:outline-none"
      :class="{
        'opacity-0': state.currentTreeNodePath?.pathElements.at(0) === node,
      }"
      @input="onChangeText"
    >
      {{ node.text }}
    </h1>
    <div ref="childrenElement">
      <Children :node="node" />
    </div>
    <button @click="addLast">
      <Icon
        icon="heroicons:plus-circle-16-solid"
        class="text-xl ml-[1.365rem]"
      />
    </button>
  </main>
</template>
