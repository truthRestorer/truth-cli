import path from 'node:path'
import { rollup } from 'rollup'
import { __scriptName, buildOptions, buildWeb } from './utils.js'

async function resolveBuild() {
  const opts = await buildOptions()
  await buildWeb({
    isDeploy: false,
    buildPath: path.resolve(__scriptName, '.../packages/cli/dist'),
  })
  for (const val of Object.values(opts)) {
    const [input, output] = val
    const bundle = await rollup(input)
    await bundle.write(output)
  }
}

resolveBuild()
