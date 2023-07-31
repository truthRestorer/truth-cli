import chalk from 'chalk'
import { Command } from 'commander'
import { genPkgsAndWeb } from 'lib'
import { outputFile } from 'lib/genFile/outputFile.js'
import { logDepthError } from 'lib/utils/const.js'
import { isNumber } from 'lib/utils/tools.js'

const program = new Command()
program
  .name('truth-cli')
  .description(chalk.cyan.bold('A command-line tool for analyzing dependencies under node_moudles'))
  .version('0.1.3')

program
  .command('analyze')
  .description(chalk.bgCyanBright('Help developer analyze npm packages'))
  .option('-d, --dep [depth]', 'the depth of the packages')
  .option('-j, --json [file-path]', 'the output file path')
  .option('-f, --force', 'the output file path')
  .action(async ({ dep, json, force }) => {
    try {
      if (json) {
        await outputFile(dep, json)
      }
      else {
        if (dep === undefined) {
          await genPkgsAndWeb({ treeDep: 2 })
          await outputFile(2)
        }
        else if (isNumber(dep)) {
          if (dep > 5 && !force)
            throw new Error('depth is too large, we can\'t output the package file, if you still want to output, please use --force')
          await genPkgsAndWeb({ treeDep: +dep })
          await outputFile(+dep)
        }
        else {
          throw new Error('Error depth')
        }
      }
    }
    catch (err: any) {
      logDepthError(err.message)
    }
  })

program.parse()
