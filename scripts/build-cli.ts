import { rollup } from 'rollup'
import { buildOptions } from './utils.js'

async function buildCli() {
  const { cli } = await buildOptions()
  const [input, output] = cli
  const bundle = await rollup(input)
  await bundle.write(output)
}

buildCli()
