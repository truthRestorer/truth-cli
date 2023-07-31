import minimist from 'minimist'
import typescript from '@rollup/plugin-typescript'
import commonjs from '@rollup/plugin-commonjs'
import terser from '@rollup/plugin-terser'
import { nodeExternals } from 'rollup-plugin-node-externals'

import json from '@rollup/plugin-json'
import { rollup } from 'rollup'
import { nodeResolve } from '@rollup/plugin-node-resolve'

// eslint-disable-next-line n/prefer-global/process
const argv = minimist(process.argv.slice(2))
const formats = ['amd', 'cjs', 'es', 'iife', 'system', 'umd']

async function buildCli(format: string) {
  if (!formats.includes(format))
    return
  const inputOptions = {
    input: './bin/index.ts',
    plugins: [
      nodeResolve({
        preferBuiltins: true,
      }),
      typescript({
        exclude: ['packages/**/*.ts', '../node_modules/@eslint/*', '../node_modules/eslint*'],
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
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  await bundle.write(outputOptions)
}

async function scriptBuild() {
  for (const key of Object.keys(argv))
    buildCli(key)
}

scriptBuild()
