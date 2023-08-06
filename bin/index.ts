import { Command } from 'commander'
import { genByCommand } from 'lib'
import { cleanFiles } from 'lib/cleanFile'
import { genJSONFile } from 'lib/genFile'
import { genTreeFile } from 'lib/genTreeFile'
import {
  analyzeCommandWords,
  bothOptionWords,
  cleanCommandWords,
  depthOptionWords,
  description,
  filePathOptionWords,
  logDepthError,
  logLogo,
  version,
} from 'lib/utils/const.js'

const program = new Command()
program
  .name('truth-cli')
  .description(description)
  .version(version)

program
  .command('analyze')
  .description(analyzeCommandWords)
  .option('-d, --dep [depth]', depthOptionWords, '2')
  .option('-j, --json [file-path]', filePathOptionWords)
  .option('-b, --both', bothOptionWords, false)
  .action(async ({ dep, json, both }) => {
    logLogo()
    try {
      const depth = +dep
      if (Number.isNaN(depth))
        throw new TypeError('illegal type of depth')
      if (json && !both) {
        genJSONFile(depth - 1, json)
        return
      }
      await genByCommand(depth + 1, depth - 1, both)
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
  .description(cleanCommandWords)
  .option('-d, --dep [depth]', depthOptionWords, '1')
  .action(async ({ dep }) => {
    await genTreeFile(+dep)
  })

program.parse()
