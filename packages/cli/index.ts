import { Command } from 'commander'
import { cleanFiles } from './src/cleanFile.js'
import {
  analyzeCommandWords,
  cleanCommandWords,
  depthOptionWords,
  description,
  filePathOptionWords,
  logDepthError,
  treeCommandWords,
  version,
} from './src/const.js'
import { genByCommand } from './src/index.js'
import { genOutputFile } from './src/genFile.js'

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
  .action(async ({ dep, json }) => {
    try {
      const depth = +dep
      if (Number.isNaN(depth))
        throw new TypeError('illegal type of depth')
      if (json) {
        await genOutputFile(depth, 'json', json)
        return
      }
      await genByCommand()
    }
    catch (err) {
      logDepthError()
    }
  })

program
  .command('clean')
  .description(cleanCommandWords)
  .action(async () => {
    await cleanFiles()
  })

program
  .command('tree')
  .description(treeCommandWords)
  .option('-d, --dep [depth]', depthOptionWords, '1')
  .option('-f, --file [file-path]', filePathOptionWords)
  .action(async ({ dep, file }) => {
    try {
      const depth = +dep
      if (Number.isNaN(depth))
        throw new TypeError('illegal type of depth')
      await genOutputFile(dep, 'txt', file)
    }
    catch (err) {
      logDepthError()
    }
  })

program.parse()
