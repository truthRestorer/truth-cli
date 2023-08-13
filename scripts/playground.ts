import path from 'node:path'
import { genJSONFile, genWebFile } from '../packages/cli/src/genFile.js'
import { __scriptName, createViteServer } from './utils.js'

async function createPlaygroundServer() {
  await genWebFile({
    dep: 3,
    writePath: path.resolve(__scriptName, '../playground/src/assets/'),
  })
  await genJSONFile(3, path.resolve(__scriptName, '../playground/src/assets/'), true)
  const server = await createViteServer(path.resolve(__scriptName, '../playground/'), 1338)
  await server.listen()
  server.printUrls()
}

createPlaygroundServer()
