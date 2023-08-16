import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { genWebFile } from '../packages/cli/src/genFile.js'
import { createViteServer } from './utils.js'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

async function createCliServer() {
  await genWebFile()
  const server = await createViteServer(path.resolve(__dirname, '../packages/web'))
  await server.listen()
  server.printUrls()
}

createCliServer()
