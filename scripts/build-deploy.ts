import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { genWebFile } from '../packages/cli/src/genFile.js'
import { buildWeb } from './utils.js'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

async function buildForDeploy() {
  await genWebFile()
  await buildWeb({
    isDeploy: true,
    buildPath: path.resolve(__dirname, '../packages/web/dist'),
    configFile: path.resolve(__dirname, '../vite.config.noZip.ts'),
  })
}

buildForDeploy()
