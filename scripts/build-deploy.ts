import path from 'node:path'
import { genByCommand } from '../packages/cli/src/index.js'
import { __scriptName, buildWeb } from './utils.js'

async function buildForDeploy() {
  await genByCommand({ dep: 3, isDev: true, isBoth: false, isDeploy: true })
  await buildWeb({
    isDeploy: true,
    buildPath: path.resolve(__scriptName, '../packages/web/dist'),
  })
}

buildForDeploy()
