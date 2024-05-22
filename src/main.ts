import { createApp } from 'vue'
import './style.css'
import { autoAnimatePlugin } from '@formkit/auto-animate/vue'
import App from './App.vue'
import { router } from './router'

createApp(App).use(autoAnimatePlugin).use(router).mount('#app')
