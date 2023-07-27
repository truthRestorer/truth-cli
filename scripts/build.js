// @ts-check

import esbuild from 'esbuild'
import { resolve, relative, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'
import minimist from 'minimist'
import { polyfillNode } from 'esbuild-plugin-polyfill-node'

const require = createRequire(import.meta.url)
const __dirname = dirname(fileURLToPath(import.meta.url))
const args = minimist(process.argv.slice(2))
const target = args._[0] || 'cli'
const format = args.f || 'global'
const inlineDeps = args.i || args.inline
const pkg = require(`../packages/${target}/package.json`)

// resolve output
const outputFormat = format.startsWith('global') ? 'iife' : format === 'cjs' ? 'cjs' : 'esm'

// FIXME: 打包后的名字
const outfile = resolve(
  __dirname,
  `../packages/${target}/dist/${target}.${target}.js`
)
const relativeOutfile = relative(process.cwd(), outfile)

// resolve externals
let external = []
if (!inlineDeps) {
  // cjs & esm-bundler: external all deps
  if (format === 'cjs' || format.includes('esm-bundler')) {
    external = [
      ...external,
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.peerDependencies || {}),
      // for @vue/compiler-sfc / server-renderer
      'path',
      'url',
      'stream',
    ]
  }
}

const plugins = [
  {
    name: 'log-rebuild',
    setup(build) {
      build.onEnd(() => {
        console.log(`built: ${relativeOutfile}`)
      })
    },
  },
]

if (format === 'cjs' || pkg.buildOptions?.enableNonBrowserBranches) {
  plugins.push(polyfillNode())
}

esbuild
  .context({
    entryPoints: [resolve(__dirname, `../packages/${target}/src/main.ts`)],
    outfile,
    bundle: true,
    external,
    sourcemap: true,
    format: outputFormat,
    globalName: pkg.buildOptions?.name,
    platform: format === 'cjs' ? 'node' : 'browser',
    plugins,
  })
  .then(ctx => ctx.watch())
