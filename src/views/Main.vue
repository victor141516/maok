<script setup lang="ts">
import NavButtons from '@/components/NavButtons.vue'
import Breadcrumb from '@/components/Breadcrumb.vue'
import Tree from '@/components/Tree.vue'
import { state } from '@/store/tree'
</script>

<template>
  <div>
    <nav
      class="sticky top-0 flex items-center justify-between gap-4 bg-primary-400/75 px-3 py-2 backdrop-blur z-10"
    >
      <NavButtons />
      <Breadcrumb class="flex-1" />
    </nav>
    <Tree :node="state.currentTreeNodePath!.currentNode()" />
  </div>
</template>
