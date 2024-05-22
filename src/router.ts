import { createWebHistory, createRouter, RouteRecordRaw } from 'vue-router'
import Main from '@/views/Main.vue'
import { BASE_PATH } from './libs/tree-path'

const routes: RouteRecordRaw[] = [
  { path: '/', redirect: BASE_PATH },
  { path: BASE_PATH + '/:paths*', component: Main },
] as const

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
