import * as esbuild from 'esbuild'
import minimist from 'minimist'
import { buildWeb } from './utils.js'

// eslint-disable-next-line n/prefer-global/process
const argv = minimist(process.argv.slice(2))
const target = argv._
const basePlugins = {
  bundle: true,
  minify: true,
  platform: 'node' as esbuild.Platform,
  format: 'esm' as esbuild.Format,
}

async function resolveBuild() {
  await esbuild.build({
    ...basePlugins,
    entryPoints: ['packages/core/index.ts', 'packages/core/node.ts'],
    outdir: 'packages/core/dist',
    sourcemap: true,
  })
  target.includes('web') && await buildWeb('../packages/cli', true)
  await esbuild.build({
    ...basePlugins,
    entryPoints: ['packages/cli/index.ts'],
    outdir: 'packages/cli/dist',
    banner: {
      js: '#! /usr/bin/env node',
    },
  })
  await esbuild.build({
    ...basePlugins,
    entryPoints: ['packages/shared/index.ts'],
    outdir: 'packages/shared/dist',
  })
}

resolveBuild()
