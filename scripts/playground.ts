import path from 'node:path'
import { genJSONFile, genTxtFile, genWebFile } from '../packages/cli/src/genFile.js'
import { __scriptName, createViteServer } from './utils.js'

async function createPlaygroundServer() {
  const playgroundAssetsPath = path.resolve(__scriptName, '../playground/src/assets/')
  await genWebFile({
    dep: 3,
    writePath: playgroundAssetsPath,
  })
  await genJSONFile(3, playgroundAssetsPath, true)
  await genTxtFile(3, playgroundAssetsPath, true)
  const server = await createViteServer(path.resolve(__scriptName, '../playground/'), 1338)
  await server.listen()
  server.printUrls()
}

createPlaygroundServer()
