import chalk from 'chalk'
import { Command } from 'commander'
import { genByCommand } from 'lib'
import { cleanFiles } from 'lib/cleanFile'
import { genJSONFile } from 'lib/genFile'
import { logDepthError } from 'lib/utils/const.js'

const program = new Command()
// TODO: 添加版本自动控制
program
  .name('truth-cli')
  .description(chalk.cyan.bold('A command-line tool for analyzing dependencies under node_moudles'))
  .version('0.2.4')

// TODO: 更好的用户提示，将 description、options 的打印语句添加到 lib/utils/const.ts 中
program
  .command('analyze')
  .description(chalk.bgCyanBright('Help developer analyze npm packages'))
  .option('-d, --dep [depth]', 'the depth of the packages, the default is 2, less than 8', '2')
  .option('-j, --json [file-path]', 'the output file path')
  .option('-b, --both', 'generate file and start webSite', false)
  .action(async ({ dep, json, both }) => {
    try {
      const depth = +dep
      if (Number.isNaN(depth))
        throw new TypeError('illegal type of depth')
      if (json && !both) {
        genJSONFile(depth, json)
        return
      }
      await genByCommand(depth, depth - 1, both)
    }
    catch (err: any) {
      logDepthError(err.message)
    }
  })

program
  .command('clean')
  .description(chalk.bgCyanBright('Clean the generated files'))
  .action(async () => {
    await cleanFiles()
  })

program.parse()
