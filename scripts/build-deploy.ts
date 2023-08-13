import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { genByCommand } from '../packages/cli/src/index.js'
import { buildWeb } from './utils.js'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

async function buildForDeploy() {
  await genByCommand({ dep: 3, isBuild: true })
  await buildWeb({
    isDeploy: true,
    buildPath: path.resolve(__dirname, '../packages/web/dist'),
  })
}

buildForDeploy()
