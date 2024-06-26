import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [tsconfigPaths({ loose: true }), vue()],
})
