import nodePolyfills from 'rollup-plugin-polyfill-node'
import typescript from '@rollup/plugin-typescript'
import minimist from 'minimist'
import path from 'path'

const argv = minimist(process.argv.slice(2))
const packagesPath = path.resolve(__dirname, 'packages')

function createCliOutput() {
  console.log(argv)
  console.log(packagesPath)
}

function createWebOutput() {

}

function createBothOutput() {

}

createCliOutput()
export default [
  {
    input: './packages/cli/bin/index.ts',
    output: [
      {
        file: 'packages/cli/dist/bundle.js',
        format: 'esm',
        banner: '#! /usr/bin/env node',
      },
    ],
    plugins: [nodePolyfills(), typescript()],
  },
]
