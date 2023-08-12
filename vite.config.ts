import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { viteSingleFile } from 'vite-plugin-singlefile'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue({
    template: {
      compilerOptions: {
        isCustomElement: tag => tag === 'json-viewer',
      },
    },
  }), viteSingleFile()],
  test: {
    exclude: ['node_modules/**'],
    globals: true,
    // simulate DOM with happy-dom
    environment: 'happy-dom',
    deps: {
      inline: [
        'echarts',
      ],
    },
    api: true,
  },
  resolve: {
    mainFields: ['module'],
  },
})
