import minimist from 'minimist'
import typescript from '@rollup/plugin-typescript'
import commonjs from '@rollup/plugin-commonjs'
import terser from '@rollup/plugin-terser'
import { nodeExternals } from 'rollup-plugin-node-externals'
import json from '@rollup/plugin-json'
import type { ModuleFormat } from 'rollup'
import { rollup } from 'rollup'
import { nodeResolve } from '@rollup/plugin-node-resolve'

// eslint-disable-next-line n/prefer-global/process
const argv = minimist(process.argv.slice(2))
const formats: ModuleFormat[] = ['amd', 'cjs', 'es', 'iife', 'system', 'umd']

async function buildCli(format: ModuleFormat) {
  if (!formats.includes(format))
    return
  const inputOptions = {
    input: 'bin/index.ts',
    plugins: [
      nodeResolve({
        preferBuiltins: true,
        exportConditions: ['node'],
      }),
      typescript({
        exclude: ['packages/**/*.ts'],
      }),
      commonjs(),
      terser(),
      json(),
      nodeExternals(),
    ],
  }
  const outputOptions = {
    dir: 'dist',
    format,
    banner: '#! /usr/bin/env node',
  }
  const bundle = await rollup(inputOptions)
  await bundle.write(outputOptions)
}

async function scriptBuild() {
  for (const key of Object.keys(argv) as any)
    buildCli(key)
}

scriptBuild()
