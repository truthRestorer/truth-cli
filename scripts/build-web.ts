import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { build } from 'vite'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

async function buildWeb() {
  await build({
    root: path.resolve(__dirname, '../packages/web'),
    base: './',
  })
}

buildWeb()
