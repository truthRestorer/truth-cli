import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { buildWeb } from './utils.js'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

buildWeb({
  isDeploy: false,
  buildPath: path.resolve(__dirname, '../packages/cli/dist'),
})
