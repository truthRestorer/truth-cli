import { genByCommand } from '../packages/cli/src/index.js'
import { createViteServer } from './utils.js'

async function createCliServer() {
  await genByCommand({ dep: 3, isDev: true, isBoth: true })
  const server = await createViteServer()
  await server.listen()
  server.printUrls()
}

createCliServer()
