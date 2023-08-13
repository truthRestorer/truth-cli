import path from 'node:path'
import { __scriptName, createViteServer } from './utils.js'

async function createPlaygroundServer() {
  const server = await createViteServer(path.resolve(__scriptName, '../playground/'), 1338)
  await server.listen()
  await server.printUrls()
}

createPlaygroundServer()
