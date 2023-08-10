import process from 'node:process'
import { rollup } from 'rollup'
import minimist from 'minimist'
import { buildOptions, buildWeb } from './utils.js'

const argv = minimist(process.argv.slice(2))

async function resolveBuild() {
  const opts = await buildOptions()
  if (argv.cli) {
    const [input, output] = opts.get('cli')
    output.banner = '#! /usr/bin/env node'
    const bundle = await rollup(input)
    await bundle.write(output)
  }
  else if (argv.web) {
    await buildWeb(false)
  }
  else {
    await buildWeb(false)
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
