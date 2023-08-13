import path from 'node:path'
import { genByCommand } from '../packages/cli/src/index.js'
import { __dirname, createViteServer } from './utils.js'

async function createCliServer() {
  await genByCommand({ dep: 3, isDev: true, isBoth: true })
  const server = await createViteServer(path.resolve(__dirname, '../packages/web'))
  await server.listen()
  server.printUrls()
}

createCliServer()
