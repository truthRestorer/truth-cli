import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { build } from 'vite'
import type { ModuleFormat } from 'rollup'
import typescript from '@rollup/plugin-typescript'
import commonjs from '@rollup/plugin-commonjs'
import terser from '@rollup/plugin-terser'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import { rollup } from 'rollup'
import { logBuildFinished } from '../lib/utils/const.js'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

export async function buildCli() {
  const inputOptions = {
    input: ['bin/index.ts'],
    plugins: [
      nodeResolve({
        preferBuiltins: true,
        exportConditions: ['node'],
      }),
      typescript({
        exclude: ['packages/web/**/*.ts', '**/__test__/**', 'node_modules/**'],
      }),
      commonjs(),
      terser(),
    ],
  }
  const outputOptions = {
    dir: 'dist',
    format: 'es' as ModuleFormat,
    banner: '#! /usr/bin/env node',
  }
  const bundle = await rollup(inputOptions)
  await bundle.write(outputOptions)
}

async function buildWeb() {
  await build({
    root: path.resolve(__dirname, '../packages/web'),
    base: './',
    build: {
      outDir: path.resolve(__dirname, '../dist'),
      copyPublicDir: false,
      emptyOutDir: true,
    },
  })
}

async function resolveBuild() {
  const begin = Date.now()
  await buildWeb()
  await buildCli()
  const end = Date.now()
  logBuildFinished(end - begin)
}

resolveBuild()
