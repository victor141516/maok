<script setup lang="ts">
import ListItem from '@/components/ListItem.vue'
import { TreeNode } from '@/libs/tree-path'
import { state } from '@/store/tree'

defineProps<{
  node: TreeNode
  inViewParentOf?: string
}>()
</script>

<template>
  <ol class="flex flex-col gap-1" v-if="node.children">
    <li v-for="child in node.children" :key="child.id">
      <ListItem
        :inViewParentOf="inViewParentOf ?? state.currentTreeNodePath?.toUrl()"
        :node="child"
      />
    </li>
  </ol>
</template>
