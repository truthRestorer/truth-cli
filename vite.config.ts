import { defineConfig } from 'vite'
import { viteSingleFile } from 'vite-plugin-singlefile'
import { compression } from 'vite-plugin-compression2'
import { basePlugins } from './vite.config.noZip'

export default defineConfig({
  plugins: [
    ...basePlugins,
    viteSingleFile(),
    compression({
      algorithm: 'brotliCompress',
      deleteOriginalAssets: true,
    }),
  ],
  build: {
    reportCompressedSize: false,
  },
})
