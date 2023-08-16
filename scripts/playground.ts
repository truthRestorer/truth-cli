import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { genOutputFile, genWebFile } from '../packages/cli/src/index.js'
import { createViteServer } from './utils.js'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

async function createPlaygroundServer() {
  const playgroundAssetsPath = path.resolve(__dirname, '../playground/src/assets/')
  await genWebFile(playgroundAssetsPath)
  await genOutputFile(3, 'both', playgroundAssetsPath)
  const server = await createViteServer(path.resolve(__dirname, '../playground/'), 1338)
  await server.listen()
  server.printUrls()
}

createPlaygroundServer()
