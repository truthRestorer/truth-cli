import process from 'node:process'
import path, { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { Command } from 'commander'
import { createServer } from 'vite'
import { analyze } from '../lib/analyze'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const program = new Command()
program.name('dep-cli').description('hell world').version('0.8.0')
program
  .description('analyze npm packages')
  .option('-d, --dep <depth>', 'display just the first substring', '1')
  .option('-j, --json <file-path>', 'separator character', './')

program.parse(process.argv)
const options = program.opts()

async function buildWeb() {
  const server = await createServer({
    // 任何合法的用户配置选项，加上 `mode` 和 `configFile`
    configFile: path.resolve(__dirname, '../../web/vite.config.ts'),
    root: path.resolve(__dirname, '../../web/'),
    server: {
      port: 1337,
    },
  })
  await server.listen()

  server.printUrls()
}

const depth = +options.dep
if (depth < 7 && !Number.isNaN(depth))
  analyze(depth)

buildWeb()
