import { rollup } from 'rollup'
import minimist from 'minimist'
import { buildOptions, buildWeb } from './utils.js'

// eslint-disable-next-line n/prefer-global/process
const argv = minimist(process.argv.slice(2))
const target = argv._

async function resolveBuild() {
  await buildWeb('../packages/cli', true)
  const opts = await buildOptions()
  for (let i = 0; i < target.length; i++) {
    const [input, output] = opts[target[i]] ? opts[target[i]]() : opts._normal(target[i])
    const bundle = await rollup(input)
    await bundle.write(output)
  }
}

resolveBuild()
