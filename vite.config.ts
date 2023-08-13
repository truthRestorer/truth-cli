import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { viteSingleFile } from 'vite-plugin-singlefile'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), viteSingleFile()],
  test: {
    exclude: ['node_modules/**'],
    globals: true,
    environment: 'happy-dom',
    deps: {
      inline: [
        'echarts',
      ],
    },
  },
})