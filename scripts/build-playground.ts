import path from 'node:path'
import { fileURLToPath } from 'node:url'

// import { genJSONFile, genTxtFile, genWebFile } from '../packages/cli/src/genFile.js'
import { buildWeb } from './utils.js'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

async function createPlaygroundServer() {
  // const playgroundAssetsPath = path.resolve(__dirname, '../playground/src/assets')
  // await genWebFile({
  //   dep: 3,
  //   writePath: playgroundAssetsPath,
  // })
  // await genJSONFile(3, playgroundAssetsPath, true)
  // await genTxtFile(3, playgroundAssetsPath, true)
  await buildWeb({
    isDeploy: true,
    buildPath: path.resolve(__dirname, '../playground/dist'),
    root: path.resolve(__dirname, '../playground/'),
  })
}

createPlaygroundServer()
