import { defineConfig } from 'vite'
import { viteSingleFile } from 'vite-plugin-singlefile'
import viteCompression from 'vite-plugin-compression'
import { basePlugins } from './vite.config.noZip'

export default defineConfig({
  plugins: [
    ...basePlugins,
    viteSingleFile(),
    viteCompression({
      ext: '.br',
      algorithm: 'brotliCompress',
      deleteOriginFile: true,
    }),
  ],
  build: {
    reportCompressedSize: false,
  },
})
