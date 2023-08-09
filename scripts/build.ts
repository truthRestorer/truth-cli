import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { build } from 'vite'
import type { ModuleFormat } from 'rollup'
import typescript from '@rollup/plugin-typescript'
import commonjs from '@rollup/plugin-commonjs'
import terser from '@rollup/plugin-terser'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import { rollup } from 'rollup'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

async function buildCli() {
  const inputOptions = {
    input: path.resolve(__dirname, '../packages/cli/bin/index.ts'),
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
    dir: path.resolve(__dirname, '../packages/cli/dist'),
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
      outDir: path.resolve(__dirname, '../packages/cli/dist'),
      copyPublicDir: false,
      emptyOutDir: true,
    },
  })
}

async function resolveBuild() {
  await buildWeb()
  await buildCli()
}

resolveBuild()
