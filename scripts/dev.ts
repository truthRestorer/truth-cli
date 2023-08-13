import path from 'node:path'
import { genByCommand } from '../packages/cli/src/index.js'
import { __scriptName, createViteServer } from './utils.js'

async function createCliServer() {
  await genByCommand({ dep: 3, isDev: true, isBoth: true })
  const server = await createViteServer(path.resolve(__scriptName, '../packages/web'))
  await server.listen()
  server.printUrls()
}

createCliServer()
