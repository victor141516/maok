<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { state } from '@/store/tree'
import { computed } from 'vue'
import { BASE_PATH, TreePath } from '@/libs/tree-path'

const links = computed(() => {
  if (!state.currentTreeNodePath) return [] as string[]

  const eachTree = [state.currentTreeNodePath] as Array<TreePath>
  for (let i = 0; i < state.currentTreeNodePath?.pathElements.length; i++) {
    eachTree.push(eachTree.at(-1)!.parent())
  }
  const result = eachTree
    .map((e) => e.toUrl())
    .reverse()
    .slice(2)
  return result
})
</script>

<template>
  <div class="flex text-sm font-medium" aria-label="Breadcrumb">
    <ol
      class="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse min-h-5"
    >
      <li class="inline-flex items-center">
        <RouterLink :to="BASE_PATH" class="inline-flex items-center">
          <Icon icon="heroicons:home-20-solid" />
        </RouterLink>
      </li>
      <li
        v-for="(node, index) in state.currentTreeNodePath?.pathElements.slice(
          1
        )"
        :key="node.id"
      >
        <div class="flex items-center">
          <Icon icon="heroicons:chevron-right-16-solid" />
          <RouterLink
            :to="links[index]"
            class="max-w-36 text-ellipsis overflow-hidden whitespace-nowrap ms-1"
            ><div class="-mt-px">{{ node.text }}</div></RouterLink
          >
        </div>
      </li>
    </ol>
  </div>
</template>
