import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { rollup } from 'rollup'
import { buildOptions, buildWeb } from './utils.js'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

async function resolveBuild() {
  const opts = await buildOptions()
  await buildWeb({
    isDeploy: false,
    buildPath: path.resolve(__dirname, '../packages/cli/dist'),
  })
  for (const val of Object.values(opts)) {
    const [input, output] = val
    const bundle = await rollup(input)
    await bundle.write(output)
  }
}

resolveBuild()
