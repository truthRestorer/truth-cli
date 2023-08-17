import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createServer } from 'vite'
import { genWebFile } from '../packages/cli/src/index.js'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

async function createDevServer() {
  await genWebFile()
  const server = await createServer({
    configFile: path.resolve(__dirname, '../vite.config.ts'),
    root: path.resolve(__dirname, '../packages/web'),
  })
  await server.listen()
  server.printUrls()
}

createDevServer()
