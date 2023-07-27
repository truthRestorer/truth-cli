#! /usr/bin/env node
import path from 'path'
import { fileURLToPath } from 'url'
import { build } from 'vite'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

;(async () => {
  await build({
    root: path.resolve(__dirname, '../packages/web'),
    build: {
      rollupOptions: {
        // ...
      },
    },
  })
})()
