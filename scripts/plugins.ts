import typescript from '@rollup/plugin-typescript'
import commonjs from '@rollup/plugin-commonjs'
import terser from '@rollup/plugin-terser'
import { nodeResolve } from '@rollup/plugin-node-resolve'

export default [
  nodeResolve({
    preferBuiltins: true,
    exportConditions: ['node'],
  }),
  typescript({
    exclude: ['packages/web/**', '**/__test__/**', 'node_modules/**', 'playground/**'],
  }),
  commonjs(),
  terser(),
]
