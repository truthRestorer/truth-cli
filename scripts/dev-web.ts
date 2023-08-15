import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { createViteServer } from './utils.js'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

async function createWebDevServer() {
  const server = await createViteServer(path.resolve(__dirname, '../packages/web/'), 5173)
  await server.listen()
  server.printUrls()
}

createWebDevServer()
