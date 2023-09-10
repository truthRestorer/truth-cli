import { cac } from 'cac'
import { genFile } from './src/file.js'
import { startWebServer } from './src/server.js'
import type { FileType } from './src/types.js'
import { v } from './src/const.js'

const depOption = '[number] depth of dependency'
const pathOption = '[string] path of file'

const cli = cac('truth-cli')

cli
  .command('[port]', '[WEB] start web server')
  .alias('web')
  .action((port) => {
    startWebServer(port)
  })

function createFileCli(type: FileType) {
  const fileCli = cli
    .command(type, `[FILE] generate ${type} file`)
    .option('-p, --path [path]', pathOption, {
      default: './',
    })
  if (type !== 'html') {
    fileCli.option('-d, --dep [dep]', depOption, {
      default: 1,
    })
  }
  fileCli.action(({ dep, path }) => {
    genFile(type, path, dep)
  })
}

createFileCli('json')
createFileCli('txt')
createFileCli('html')

cli.version(v)
cli.help()
cli.parse()
