<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const routerState = ref(router.options.history.state)

watch(route, () => {
  routerState.value = router.options.history.state
})
</script>

<template>
  <div class="flex gap-2 text-xl">
    <a
      :disabled="routerState.back === null"
      :class="{ 'opacity-50': routerState.back === null }"
      @click.stop.prevent="() => routerState.back !== null && router.back()"
      :href="routerState.back as string"
    >
      <Icon icon="heroicons:chevron-left"></Icon>
    </a>
    <a
      :disabled="routerState.forward === null"
      :class="{
        'opacity-50': routerState.forward === null,
      }"
      @click.stop.prevent="
        () => routerState.forward !== null && router.forward()
      "
      :href="routerState.forward as string"
    >
      <Icon icon="heroicons:chevron-right"></Icon>
    </a>
  </div>
</template>
