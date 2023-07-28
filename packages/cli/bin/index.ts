import path, { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import chalk from 'chalk'
import { Command } from 'commander'
import { createServer } from 'vite'
import { analyze } from '../lib/analyze'
import useModules from '../lib/genPkgs'
import { logDepthError } from '../const'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const program = new Command()
program.name('dep-cli').description(chalk.cyan.bold('A command-line tool for analyzing dependencies under node_moudles')).version('0.0.1')

program.command('analyze')
  .description(chalk.bgCyanBright('Help developer analyze npm packages'))
  .option('-d, --dep [depth]', 'the depth of the packages', '2')
  .option('-j, --json [file-path]', 'the output file path')
  .action(async ({ dep, json }) => {
    if (json) {
      analyze(dep, json)
    }
    else {
      if (dep < 7 && !Number.isNaN(dep)) {
        analyze(dep)
        await startVite()
      }
      else {
        logDepthError()
      }
    }
  })

program.parse()

async function startVite() {
  useModules()

  const server = await createServer({
    // 任何合法的用户配置选项，加上 `mode` 和 `configFile`
    configFile: `${path.resolve(__dirname, '../../web/vite.config.ts')}`,
    root: `${path.resolve(__dirname, '../../web')}`,
  })
  await server.listen()

  server.printUrls()
}
