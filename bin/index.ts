import chalk from 'chalk'
import { Command } from 'commander'
import { genPkgsAndWeb } from 'lib'
import { cleanFiles } from 'lib/cleanFile'
import { outputFile } from 'lib/genFile/outputFile.js'
import { logDepthError } from 'lib/utils/const.js'

const program = new Command()
// TODO: 添加版本自动控制
program
  .name('truth-cli')
  .description(chalk.cyan.bold('A command-line tool for analyzing dependencies under node_moudles'))
  .version('0.2.4')

// TODO: 当数据过大时(例如 dep > 5 时)，支持数据流写入
// TODO: 支持更多命令行，例如 --delete 删除生成的文件
// TODO: 更好的用户提示，将 description、options 的打印语句添加到 lib/utils/const.ts 中
program
  .command('analyze')
  .description(chalk.bgCyanBright('Help developer analyze npm packages'))
  .option('-d, --dep [depth]', 'the depth of the packages', '2')
  .option('-j, --json [file-path]', 'the output file path')
  .option('-f, --force', 'generate the pkgs.json by force', false)
  .option('-w, --web', 'only start webSite', false)
  .action(async ({ dep, json, force, web }) => {
    // TODO: 优化一下判断逻辑
    try {
      if (json) {
        await outputFile(+dep, json === true ? './' : json)
      }
      else {
        const depth = +dep
        if (Number.isNaN(depth))
          throw new Error('depth must be a number')
        if (dep > 5 && !force)
          throw new Error('depth is too large, we can\'t output the package file, if you still want to output, please use --force')
        await genPkgsAndWeb({ treeDep: depth, pkgDep: depth, isWeb: web })
      }
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
