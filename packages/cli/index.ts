import { Command } from 'commander'
import {
  analyzeCommandWords,
  depthOptionWords,
  description,
  filePathOptionWords,
  logError,
  treeCommandWords,
  version,
} from './src/const.js'
import { genFile } from './src/file.js'
import { startWebServer } from './src/server.js'

const program = new Command()
program
  .name('truth-cli')
  .description(description)
  .version(version)

program
  .command('analyze')
  .description(analyzeCommandWords)
  .option('-d, --dep [depth]', depthOptionWords, '3')
  .option('-j, --json [file-path]', filePathOptionWords)
  .action(({ dep, json }) => {
    try {
      const depth = +dep
      if (Number.isNaN(depth))
        throw new TypeError('illegal type of depth')
      if (json) {
        genFile(depth, 'json', json)
        return
      }
      startWebServer()
    }
    catch (err: any) {
      logError(err.message)
    }
  })

program
  .command('tree')
  .description(treeCommandWords)
  .option('-d, --dep [depth]', depthOptionWords, '1')
  .option('-f, --file [file-path]', filePathOptionWords)
  .action(({ dep, file }) => {
    try {
      const depth = +dep
      if (Number.isNaN(depth))
        throw new TypeError('illegal type of depth')
      genFile(dep, 'txt', file)
    }
    catch (err: any) {
      logError(err.message)
    }
  })

program.parse()
