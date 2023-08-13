import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { genByCommand } from '../packages/cli/src/index.js'
import { createViteServer } from './utils.js'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

async function createCliServer() {
  await genByCommand({ dep: 3, isBuild: true, isBoth: true })
  const server = await createViteServer(path.resolve(__dirname, '../packages/web'))
  await server.listen()
  server.printUrls()
}

createCliServer()
