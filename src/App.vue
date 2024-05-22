<script setup lang="ts">
import { useRoute } from 'vue-router'
import { state } from '@/store/tree'
import { TreePath, TreePathLocalConsumer } from '@/libs/tree-path'
import { ref, watch } from 'vue'
import userDataJson from './data.json'

const initialized = ref(false)
const treePath = new TreePath([] as string[], userDataJson)
state.currentTreeNodePath = treePath
const localConsumer = new TreePathLocalConsumer(treePath)
treePath.useConsumer(localConsumer)

const route = useRoute()
watch(route, () => {
  state.currentTreeNodePath!.initialize([...(route.params!.paths ?? [])])
  initialized.value = true
})
</script>

<template>
  <RouterView />
</template>
