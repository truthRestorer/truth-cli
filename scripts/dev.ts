import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createServer } from 'vite'
import minimist from 'minimist'
import { genWebFile } from './utils.js'

// eslint-disable-next-line n/prefer-global/process
const argv = minimist(process.argv.slice(2))
const __dirname = fileURLToPath(new URL('.', import.meta.url))

async function createDevServer() {
  const {
    web: _web,
    path: _path,
    playground: _playground,
  } = argv
  const writePath = path.resolve(__dirname, `${_path}/${_web ? '/public' : '/src/assets'}`)
  await genWebFile(writePath)
  const server = await createServer({
    configFile: path.resolve(__dirname, '../vite.config.ts'),
    root: path.resolve(__dirname, _path),
  })
  await server.listen(_web ? 5173 : 1337)
  server.printUrls()
}

createDevServer()
