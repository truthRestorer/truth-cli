import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { genOutputFile, genWebFile } from '../packages/cli/src/genFile.js'
import { buildWeb } from './utils.js'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

async function createPlaygroundServer() {
  const playgroundAssetsPath = path.resolve(__dirname, '../playground/src/assets')
  await genWebFile(playgroundAssetsPath)
  await genOutputFile(3, 'both', playgroundAssetsPath)
  await buildWeb({
    isDeploy: true,
    buildPath: path.resolve(__dirname, '../playground/dist'),
    root: path.resolve(__dirname, '../playground/'),
    configFile: path.resolve(__dirname, '../vite.config.noZip.ts'),
  })
}

createPlaygroundServer()
