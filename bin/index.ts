import chalk from 'chalk'
import { Command } from 'commander'
import { genPkgsAndWeb } from 'lib'
import { outputFile } from 'lib/genFile/outputFile.js'
import { logDepthError } from 'lib/utils/const.js'
import { isNumber } from 'lib/utils/tools.js'

const program = new Command()
// TODO: 添加版本自动控制
program
  .name('truth-cli')
  .description(chalk.cyan.bold('A command-line tool for analyzing dependencies under node_moudles'))
  .version('0.1.3')

// TODO: 当数据过大时(例如 dep > 5 时)，支持数据流写入
// TODO: 支持更多命令行，例如 --delete 删除生成的文件
// TODO: 更好的用户提示，将 description、options 的打印语句添加到 lib/utils/const.ts 中
program
  .command('analyze')
  .description(chalk.bgCyanBright('Help developer analyze npm packages'))
  .option('-d, --dep [depth]', 'the depth of the packages')
  .option('-j, --json [file-path]', 'the output file path')
  .option('-f, --force', 'generate the pkgs.json by force')
  .option('-w, --web', 'on start webSite')
  .action(async ({ dep, json, force, web }) => {
    // TODO: 优化一下判断逻辑
    try {
      if (json) {
        await outputFile(dep ?? 2, typeof json === 'boolean' ? './' : json)
      }
      else {
        if (dep === undefined) {
          await genPkgsAndWeb({ treeDep: 3, pkgDep: 2, isWeb: web })
        }
        else if (isNumber(dep)) {
          if (dep > 5 && !force)
            throw new Error('depth is too large, we can\'t output the package file, if you still want to output, please use --force')
          await genPkgsAndWeb({ treeDep: +dep, pkgDep: +dep, isWeb: web })
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
