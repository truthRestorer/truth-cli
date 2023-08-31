import * as esbuild from 'esbuild'
import minimist from 'minimist'
import { buildWeb } from './utils.js'

// eslint-disable-next-line n/prefer-global/process
const argv = minimist(process.argv.slice(2))
const target = argv._

async function resolveBuild() {
  target.includes('web') && await buildWeb('../packages/cli', true)
  await esbuild.build({
    entryPoints: ['packages/core/index.ts', 'packages/core/node.ts'],
    bundle: true,
    outdir: 'packages/core/dist',
    minify: true,
    platform: 'node',
    format: 'esm',
  })
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
