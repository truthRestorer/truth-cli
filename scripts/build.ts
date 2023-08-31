import fs from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import * as esbuild from 'esbuild'
import minimist from 'minimist'
import { buildWeb } from './utils.js'

// eslint-disable-next-line n/prefer-global/process
const argv = minimist(process.argv.slice(2))
const target = argv._
const __dirname = fileURLToPath(new URL('.', import.meta.url))

async function resolveBuild() {
  await esbuild.build({
    entryPoints: ['packages/core/index.ts', 'packages/core/node.ts'],
    bundle: true,
    outdir: 'packages/core/dist',
    minify: true,
    platform: 'node',
    format: 'esm',
  })
  target.includes('web') && await buildWeb('../packages/cli', true)
  await esbuild.build({
    entryPoints: ['packages/cli/index.ts'],
    bundle: true,
    outdir: 'packages/cli/dist',
    minify: true,
    platform: 'node',
    format: 'esm',
    banner: {
      js: '#! /usr/bin/env node',
    },
  })
  const cliDistPath = path.resolve(__dirname, '../packages/cli/dist/assets')
  const file = await fs.readdir(cliDistPath)
  const oladPath = path.resolve(cliDistPath, file[0])
  const newPath = path.resolve(cliDistPath, 'worker.js.br')
  await fs.rename(oladPath, newPath)
  await esbuild.build({
    entryPoints: ['packages/shared/index.ts'],
    bundle: true,
    outdir: 'packages/shared/dist',
    minify: true,
    platform: 'node',
    format: 'esm',
  })
}

resolveBuild()
