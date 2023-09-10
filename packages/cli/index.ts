import { cac } from 'cac'
import { depOption, pathOption } from './src/const.js'
import { genFile } from './src/file.js'
import { startWebServer } from './src/server.js'
import type { FileType } from './src/types.js'

const cli = cac('truth-cli')

cli.command('web', 'start web server').action(() => {
  startWebServer()
})

function createFileCli(type: FileType) {
  const fileCli = cli
    .command(type, `generate ${type} file`)
    .option('-p, --path [path]', pathOption, {
      default: './',
    })
  if (type !== 'html') {
    fileCli
      .option('-d, --dep [dep]', depOption, {
        default: 1,
      })
      .action(async ({ dep, path }) => {
        await genFile(dep, type, path)
      })
  }
}

createFileCli('json')
createFileCli('txt')
createFileCli('html')

cli.help()
cli.parse()
