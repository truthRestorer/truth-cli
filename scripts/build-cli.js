// @ts-check

import minimist from 'minimist'
import path from 'path'
import { fileURLToPath } from 'url'
import nodePolyfills from 'rollup-plugin-polyfill-node'
import typescript from '@rollup/plugin-typescript'
import { rollup } from 'rollup'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const argv = minimist(process.argv.slice(2))
const packagesPath = path.resolve(__dirname, '../packages/')
const formats = ['amd', 'cjs', 'es', 'iife', 'system', 'umd']

/**
 * 构建 packages/cli
 * @param {string} format
 * @returns
 */
async function buildCli(format) {
  if (!formats.includes(format)) return
  const inputOptions = {
    input: `${packagesPath}/cli/bin/index.ts`,
    plugins: [nodePolyfills(), typescript()],
  }
  const outputOptions = {
    file: `${packagesPath}/cli/dist/bundle.${format}.js`,
    format,
    banner: '#! /usr/bin/env node',
  }
  const bundle = await rollup(inputOptions)
  // @ts-ignore
  await bundle.write(outputOptions)
}

async function scriptBuild() {
  for (const key of Object.keys(argv)) {
    buildCli(key)
  }
}

scriptBuild()