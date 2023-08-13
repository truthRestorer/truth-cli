import path from 'node:path'
import { __scriptName, buildWeb } from './utils.js'

buildWeb({
  isDeploy: false,
  buildPath: path.resolve(__scriptName, '../packages/cli/dist'),
})
