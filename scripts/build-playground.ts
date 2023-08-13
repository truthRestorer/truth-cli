import path from 'node:path'
import { genJSONFile, genTxtFile, genWebFile } from '../packages/cli/src/genFile.js'
import { __scriptName, buildWeb } from './utils.js'

async function createPlaygroundServer() {
  const playgroundAssetsPath = path.resolve(__scriptName, '../playground/src/assets')
  await genWebFile({
    dep: 3,
    writePath: playgroundAssetsPath,
  })
  await genJSONFile(3, playgroundAssetsPath, true)
  await genTxtFile(3, playgroundAssetsPath, true)
  await buildWeb({
    isDeploy: true,
    buildPath: path.resolve(__scriptName, '../playground/dist'),
    root: path.resolve(__scriptName, '../playground/'),
  })
}

createPlaygroundServer()
