<script setup lang="ts">
import { Icon } from '@iconify/vue'
import Children from '@/components/Children.vue'
import { TreeNode } from '@/libs/tree-path'
import { state } from '@/store/tree'
import { computed, ref, watch } from 'vue'

const props = defineProps<{
  node: TreeNode
  inViewParentOf?: string
}>()

const emit = defineEmits<{
  change: [value: string]
}>()

const isChildrenOpen = ref(false)
const indexAmongChildren = computed(() => {
  const nodeIndex = state.currentTreeNodePath?.pathElements
    .at(-1)!
    .children!.findIndex((e) => e.id === props.node.id)!
  return nodeIndex
})
const currentNodeJsonPath = computed(() => {
  const parentPath = state.currentTreeNodePath!.toJsonPath()
  const path = parentPath + '.children.' + indexAmongChildren.value.toString()
  return path
})

const onChangeText = (event: Event) => {
  const target = event.target as HTMLElement
  state.currentTreeNodePath?.commit({
    action: 'update',
    path: currentNodeJsonPath.value + '.text',
    value: target.innerText,
  })
}

const onEnterKey = () => {
  state.currentTreeNodePath?.commit({
    action: 'addAfter',
    path: state.currentTreeNodePath!.toJsonPath() + '.children',
    value: props.node.id,
  })
  setTimeout(() => {
    ;(
      rootHtmlElement.value?.parentElement?.nextElementSibling?.querySelector(
        '.node-text'
      ) as HTMLElement
    ).focus()
  }, 10)
}

const rootHtmlElement = ref<HTMLElement | null>(null)
</script>

<template>
  <div class="flex gap-2" ref="rootHtmlElement">
    <div class="self-start pt-[0.2rem] flex gap-1 items-center">
      <button
        @click="isChildrenOpen = !isChildrenOpen"
        :disabled="!node.children"
        class="transition-transform"
        :class="{
          'pointer-events-none opacity-0': !node.children,
          'rotate-90': isChildrenOpen,
        }"
      >
        <Icon class="text-lg text-primary-800" icon="heroicons:play-solid" />
      </button>
      <RouterLink :to="inViewParentOf + '/' + node.id.toString()">
        <span
          class="rounded-full h-5 aspect-square flex items-center justify-center"
          :class="{
            'bg-primary-500 shadow-inner':
              node.children && node.children.length > 0,
          }"
        >
          <span
            class="rounded-full bg-primary-800 h-2 aspect-square shadow"
          ></span>
        </span>
      </RouterLink>
    </div>
    <div v-auto-animate="{ duration: 50 }" class="w-full">
      <div
        @input="onChangeText"
        @keydown.enter.stop.prevent="onEnterKey"
        contentEditable="true"
        class="cursor-text contentEditable:outline-none node-text"
      >
        {{ node.text }}
      </div>
      <Children
        v-if="isChildrenOpen"
        :node="node"
        :inViewParentOf="inViewParentOf + '/' + node.id.toString()"
        class="-ml-4"
      />
    </div>
  </div>
</template>
