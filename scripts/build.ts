import { rollup } from 'rollup'
import { buildOptions, buildWeb } from './utils.js'

async function resolveBuild() {
  const opts = await buildOptions()
  await buildWeb({ isDeploy: false })
  for (const val of Object.values(opts)) {
    const [input, output] = val
    const bundle = await rollup(input)
    await bundle.write(output)
  }
}

resolveBuild()
