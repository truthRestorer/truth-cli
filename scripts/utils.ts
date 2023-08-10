import path from 'node:path'
import fs from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import type { ModuleFormat } from 'rollup'
import typescript from '@rollup/plugin-typescript'
import commonjs from '@rollup/plugin-commonjs'
import terser from '@rollup/plugin-terser'
import { nodeResolve } from '@rollup/plugin-node-resolve'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const packagesDir = path.resolve(__dirname, '../packages/')

export async function buildOptions() {
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
  const opts = new Map()
  for (let i = 0; i < dirs.length; i++) {
    if (dirs[i] !== 'web') {
      opts.set(dirs[i], [
        {
          input: path.resolve(__dirname, `../packages/${dirs[i]}/index.ts`),
          plugins,
        },
        {
          dir: path.resolve(__dirname, `../packages/${dirs[i]}/dist`),
          format: 'es' as ModuleFormat,
        },
      ])
    }
  }
  return opts
}
