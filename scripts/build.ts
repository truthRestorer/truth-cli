import fs from 'node:fs'
import { rollup } from 'rollup'
import minimist from 'minimist'
import { buildOptions, buildWeb } from './utils.js'

// eslint-disable-next-line n/prefer-global/process
const argv = minimist(process.argv.slice(2))
const target = argv._

async function resolveBuild() {
  target.length > 1 && await buildWeb('../packages/cli', true)
  const opts = await buildOptions()
  for (let i = 0; i < target.length; i++) {
    const [input, output] = opts[target[i]] ? opts[target[i]]() : opts._normal(target[i])
    const distPath = output.dir
    if (target[i] === 'core' && fs.existsSync(distPath)) {
      const files = fs.readdirSync(distPath)
      for (let i = 0; i < files.length; i++)
        fs.unlinkSync(`${distPath}/${files[i]}`)
    }
    const bundle = await rollup(input)
    await bundle.write(output)
  }
}

resolveBuild()
