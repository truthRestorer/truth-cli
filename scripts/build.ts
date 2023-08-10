import path from 'node:path'
import { fileURLToPath } from 'node:url'
import process from 'node:process'
import { build } from 'vite'
import { rollup } from 'rollup'
import minimist from 'minimist'
import { buildOptions } from './utils.js'

const argv = minimist(process.argv.slice(2))
const __dirname = fileURLToPath(new URL('.', import.meta.url))

async function buildWeb(isDeploy?: boolean) {
  const webBuildPath = isDeploy ? '../packages/web/dist' : '../packages/cli/dist'
  const buildBaseOpt: any = {
    root: path.resolve(__dirname, '../packages/web'),
    base: './',
    build: {
      outDir: path.resolve(__dirname, webBuildPath),
    },
  }
  if (!isDeploy) {
    buildBaseOpt.build.copyPublicDir = false
    buildBaseOpt.build.emptyOutDir = true
  }
  await build(buildBaseOpt)
}

async function resolveBuild() {
  const opts = await buildOptions()
  if (argv.cli) {
    const [input, output] = opts.get('cli')
    output.banner = '#! /usr/bin/env node'
    const bundle = await rollup(input)
    await bundle.write(output)
  }
  else if (argv.web) {
    await buildWeb(argv.deploy)
  }
  else {
    await buildWeb(argv.deploy)
    for (const val of opts.values()) {
      const [input, output] = val
      if (val === 'cli')
        output.banner = '#! /usr/bin/env node'
      const bundle = await rollup(input)
      await bundle.write(output)
    }
  }
}

resolveBuild()
