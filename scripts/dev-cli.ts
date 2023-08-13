import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { createServer } from 'vite'
import { genByCommand } from '../packages/cli/src/index.js'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

export async function createViteServer() {
  const server = await createServer({
    configFile: path.resolve(__dirname, '../vite.config.ts'),
    root: path.resolve(__dirname, '../packages/web'),
    server: {
      port: 1337,
    },
  })

  return server
}

async function createCliServer() {
  await genByCommand({ dep: 3, isDev: true, isBoth: true })
  const server = await createViteServer()
  await server.listen()
  server.printUrls()
}

createCliServer()
