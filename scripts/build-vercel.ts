import path from 'node:path'
import { writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import minimist from 'minimist'
import { genPkgTree, genPkgs } from '@truth-cli/core'
import { genRelations } from '@truth-cli/core/node'
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
    const relations = genRelations()
    await writeFile(`${writePath}/pkgs.json`, JSON.stringify(genPkgs(3, relations)))
    await writeFile(`${writePath}/pkgs.txt`, genPkgTree(3, relations))
  }
  await buildWeb(_path)
}

resolveBuild()
