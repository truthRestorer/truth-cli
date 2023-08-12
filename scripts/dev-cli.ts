import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { createServer } from 'vite'
import { genByCommand } from '../packages/cli/src/index.js'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

async function createCliServer() {
  await genByCommand({ dep: 3, isDev: true, isBoth: true })
  const server = await createServer({
    // 任何合法的用户配置选项，加上 `mode` 和 `configFile`
    configFile: path.resolve(__dirname, '../vite.config.ts'),
    root: path.resolve(__dirname, '../packages/web'),
    server: {
      port: 1337,
    },
  })
  await server.listen()

  server.printUrls()
}

createCliServer()
