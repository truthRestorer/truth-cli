import { cac } from 'cac'
import {
  depOpts,
  logError,
  pathOpts,
} from './src/const.js'
import { genFile } from './src/file.js'
import { startWebServer } from './src/server.js'

const cli = cac('truth-cli')

cli.command('web').action(() => {
  startWebServer()
})

cli
  .command('json')
  .option('--dep [dep]', depOpts(), {
    default: 1,
  })
  .option('--path [path]', pathOpts(), {
    default: './',
  })
  .action(({ dep, path }) => {
    try {
      if (Number.isNaN(dep))
        throw new TypeError('illegal type of depth')
      genFile(dep, 'json', path)
    }
    catch (err: any) {
      logError(err.message)
    }
  })

cli
  .command('tree')
  .option('--dep [dep]', depOpts(), {
    default: 1,
  })
  .option('--path [path]', pathOpts(), {
    default: './',
  })
  .action(({ dep, file }) => {
    try {
      if (Number.isNaN(dep))
        throw new TypeError('illegal type of depth')
      genFile(dep, 'txt', file)
    }
    catch (err: any) {
      logError(err.message)
    }
  })

cli.help()
cli.parse()
