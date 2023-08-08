import typescript from '@rollup/plugin-typescript'
import commonjs from '@rollup/plugin-commonjs'
import terser from '@rollup/plugin-terser'
import json from '@rollup/plugin-json'
import type { ModuleFormat } from 'rollup'
import { rollup } from 'rollup'
import { nodeResolve } from '@rollup/plugin-node-resolve'

async function buildCli() {
  const inputOptions = {
    input: ['bin/index.ts'],
    plugins: [
      nodeResolve({
        preferBuiltins: true,
        exportConditions: ['node'],
      }),
      typescript({
        exclude: ['packages/web/**/*.ts', '**/__test__/**'],
      }),
      commonjs(),
      terser(),
      json(),
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

buildCli()
