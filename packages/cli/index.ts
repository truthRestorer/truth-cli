import { cac } from 'cac'
import { logError } from './src/const.js'
import { genFile } from './src/file.js'
import { startWebServer } from './src/server.js'

const cli = cac('truth-cli')

cli.command('web').action(() => {
  startWebServer()
})

cli
  .command('json')
  .option('--dep [dep]', 'Dependency depth, default is 1', {
    default: 1,
  })
  .option('--path [path]', 'Path to generate pkgs.json file, the default is ./', {
    default: './',
  })
  .action(({ dep, path }) => {
    try {
      const depth = Number(dep)
      if (Number.isNaN(depth))
        throw new TypeError('illegal type of depth')
      genFile(depth, 'json', path)
    }
    catch (err: any) {
      logError(err.message)
    }
  })

cli
  .command('txt')
  .option('--dep [dep]', 'Dependency depth, default is 1', {
    default: 1,
  })
  .option('--path [path]', 'Path to generate pkgs.txt file, the default is ./', {
    default: './',
  })
  .action(({ dep, path }) => {
    try {
      const depth = Number(dep)
      if (Number.isNaN(depth))
        throw new TypeError('illegal type of depth')
      genFile(depth, 'txt', path)
    }
    catch (err: any) {
      logError(err.message)
    }
  })

cli.help()
cli.parse()
