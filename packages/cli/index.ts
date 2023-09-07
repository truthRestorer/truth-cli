import { cac } from 'cac'
import { depOption, pathOption } from './src/const.js'
import { genFile } from './src/file.js'
import { startWebServer } from './src/server.js'
import type { FileType } from './src/types.js'

const cli = cac('truth-cli')

cli.command('web').action(() => {
  startWebServer()
})

function createFileCli(type: FileType) {
  cli
    .command(type)
    .option('-d, --dep [dep]', depOption, {
      default: 1,
    })
    .option('-p, --path [path]', pathOption, {
      default: './',
    })
    .action(async ({ dep, path }) => {
      await genFile(dep, type, path)
    })
}

createFileCli('json')
createFileCli('txt')
createFileCli('html')

cli.help()
cli.parse()
