import path from 'node:path'
import { writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import * as esbuild from 'esbuild'
import minimist from 'minimist'
import { genJson } from '../packages/core/src/json.js'
import { genTxt } from '../packages/core/src/txt.js'
import { genRelations } from '../packages/core/src/relations.js'

import { buildWeb, genWebFile } from './utils.js'

const argv = minimist(process.argv.slice(2))
const __dirname = fileURLToPath(new URL('.', import.meta.url))

// 发布到 vercel 中去
async function resolveBuild() {
  await esbuild.build({
    entryPoints: ['packages/core/index.ts', 'packages/core/node.ts'],
    bundle: true,
    outdir: 'packages/core/dist',
    minify: true,
    platform: 'node',
    format: 'esm',
  })
  const { web: _web, path: _path, playground: _playground } = argv
  const writePath = path.resolve(
    __dirname,
    `${_path}/${_web ? 'public' : '/src/assets'}`,
  )
  await genWebFile(writePath)
  if (_playground) {
    const relations = genRelations()
    await writeFile(
      `${writePath}/pkgs.json`,
      JSON.stringify(genJson(3, relations)),
    )
    await writeFile(`${writePath}/pkgs.txt`, genTxt(3, relations))
  }
  await buildWeb(_path)
}

resolveBuild()
