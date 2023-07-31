import chalk from 'chalk'
import { Command } from 'commander'
import { genPkgsAndWeb } from 'lib'
import { outputFile } from 'lib/genFile/outputFile'
import { logDepthError } from 'lib/utils/const'
import { isNumber } from 'lib/utils/tools'

const program = new Command()
program.name('truth-cli').description(chalk.cyan.bold('A command-line tool for analyzing dependencies under node_moudles')).version('0.0.1')

program.command('analyze')
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
        if (!isNumber(dep))
          throw new Error('the dep is not a number')
        if (dep > 5 && !force)
          throw new Error('depth is too large, we can\'t output the package file, if you still want to output, please use')
        await genPkgsAndWeb(dep)
        await outputFile(dep)
      }
    }
    catch (err: any) {
      logDepthError(err.message)
    }
  })

program.parse()
