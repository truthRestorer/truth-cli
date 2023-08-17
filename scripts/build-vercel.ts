import path from 'node:path'
import { fileURLToPath } from 'node:url'
import minimist from 'minimist'
import { genOutputFile, genWebFile } from '../packages/cli/src/index.js'
import { buildWeb } from './utils.js'

// eslint-disable-next-line n/prefer-global/process
const argv = minimist(process.argv.slice(2))
const target = argv._
console.log(argv)
const __dirname = fileURLToPath(new URL('.', import.meta.url))

async function resolveBuild() {
  console.log(target)
  const {
    web: _web,
    path: _path,
    playground: _playground,
    vercel: _vercel,
  } = argv
  // 发布到 vercel 中去
  if (_web) {
    await genWebFile()
  }
  else if (_playground) {
    const assetPath = path.resolve(__dirname, '../playground/src/assets')
    await genWebFile(assetPath)
    await genOutputFile(3, 'both', assetPath)
  }
  await buildWeb(_path)
}

resolveBuild()
