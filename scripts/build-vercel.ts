import path from 'node:path'
import { fileURLToPath } from 'node:url'
import minimist from 'minimist'
import { genPkgsFile } from '../packages/cli/src/index.js'
import { buildWeb, genWebFile } from './utils.js'

// eslint-disable-next-line n/prefer-global/process
const argv = minimist(process.argv.slice(2))
const __dirname = fileURLToPath(new URL('.', import.meta.url))

// 发布到 vercel 中去
async function resolveBuild() {
  const {
    web: _web,
    path: _path,
    playground: _playground,
  } = argv
  const writePath = path.resolve(__dirname, `${_path}/${_web ? 'public' : '/src/assets'}`)
  await genWebFile(writePath)
  if (_playground) {
    await genPkgsFile(3, 'txt', writePath)
    await genPkgsFile(3, 'json', writePath)
  }
  await buildWeb(_path)
}

resolveBuild()
