import { rollup } from 'rollup'
import { buildOptions } from './utils'

async function buildCli() {
  const { cli } = await buildOptions()
  const [input, output] = cli
  const bundle = await rollup(input)
  await bundle.write(output)
}

buildCli()
