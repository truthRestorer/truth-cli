import path from 'node:path'
import { fileURLToPath } from 'node:url'
import process from 'node:process'
import fs from 'node:fs/promises'
import { build } from 'vite'
import type { ModuleFormat } from 'rollup'
import typescript from '@rollup/plugin-typescript'
import commonjs from '@rollup/plugin-commonjs'
import terser from '@rollup/plugin-terser'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import { rollup } from 'rollup'
import minimist from 'minimist'

const argv = minimist(process.argv.slice(2))
const __dirname = fileURLToPath(new URL('.', import.meta.url))
const packagesDir = path.resolve(__dirname, '../packages/')

async function buildOptions() {
  const dirs = await fs.readdir(packagesDir)
  const plugins = [
    nodeResolve({
      preferBuiltins: true,
      exportConditions: ['node'],
    }),
    typescript({
      exclude: ['packages/web/**/*.ts', '**/__test__/**', 'node_modules/**'],
    }),
    commonjs(),
    terser(),
  ]
  const opts: any = {}
  for (let i = 0; i < dirs.length; i++) {
    if (dirs[i] !== 'web') {
      opts[dirs[i]] = {
        input: {
          input: path.resolve(__dirname, `../packages/${dirs[i]}/index.ts`),
          plugins,
        },
        output: {
          dir: path.resolve(__dirname, `../packages/${dirs[i]}/dist`),
          format: 'es' as ModuleFormat,
        },
      }
    }
  }
  return opts
}

async function buildCli() {
  const { cli } = await buildOptions()
  const outputOptions = {
    ...cli.output,
    banner: '#! /usr/bin/env node',
  }
  const bundle = await rollup(cli.input)
  await bundle.write(outputOptions)
}

async function buildShared() {
  const { shared } = await buildOptions()
  const bundle = await rollup(shared.input)
  await bundle.write(shared.output)
}

async function buildWeb() {
  await build({
    root: path.resolve(__dirname, '../packages/web'),
    base: './',
    build: {
      outDir: path.resolve(__dirname, '../packages/cli/dist'),
      copyPublicDir: false,
      emptyOutDir: true,
    },
  })
}

async function resolveBuild() {
  if (argv.cli) {
    await buildCli()
  }
  else if (argv.web) {
    await buildWeb()
  }
  else {
    await buildShared()
    await buildWeb()
    await buildCli()
  }
}

resolveBuild()
