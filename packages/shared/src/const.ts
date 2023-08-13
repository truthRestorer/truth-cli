/* eslint-disable no-console */
// TODO: 完成各种报错以及其他打印语句
import { fileURLToPath } from 'node:url'
import { resolve } from 'node:path'
import fs from 'node:fs'
import { Chalk } from 'chalk'

const chalk = new Chalk({ level: 3 })
const __dirname = fileURLToPath(new URL('.', import.meta.url))

// TODO: 根据项目根目录的 package.json 文件自动控制版本和描述
// 之前直接 import 会导致 dev 命令失效，暂时没有什么好办法

const { version: v, description: c } = JSON.parse(fs.readFileSync(resolve('./packages/cli/package.json')).toString())
const errorPrefix = chalk.bgRedBright('Error!')
const localPrefix = `➜  ${chalk.whiteBright.bold('Local')}:`
const filePrefix = `➜  ${chalk.whiteBright.bold('File:')}:`

const fileWirteError = `  ${errorPrefix} ${chalk.cyan.yellow('Here is error message:')}`
export function logFileWirteError(message: string) {
  console.log(`${fileWirteError}: ${message}\n`)
}

const depthError = `
  ${errorPrefix} ${chalk.redBright('illegal type of depth')}`
export function logDepthError() {
  console.log(`${depthError}\n`)
}

const logo = `
  ${chalk.greenBright.bold('TRUTH-CLI')} ${chalk.greenBright(`v${v}`)}
`
export function logLogo() {
  console.log(logo)
}

const webStart = `  ${localPrefix} ${chalk.cyan('http://localhost:3002')}\t`
export function logWebStart(duration: number) {
  console.log(`${webStart} ${chalk.black('ready in')} ${chalk.whiteBright.bold(duration)} ${chalk.black('ms')}\n`)
}

export function logFileWirteFinished(duration: number, p: string) {
  console.log(`  ${filePrefix} ${chalk.cyan(resolve(p, './pkgs.json'))}\t${chalk.black('ready in')} ${chalk.whiteBright.bold(duration)} ${chalk.black('ms')}\n`)
}

const cleanError = `
  ${errorPrefix} ${chalk.black('There are no files to clean up')}
`
export function logCleanError() {
  console.log(cleanError)
}

const cleanFinish = `
  ${chalk.cyanBright.bold('File cleanup succeeded!')}
`
export function logCleanFinish() {
  console.log(cleanFinish)
}

export const description = chalk.cyan.bold(c)
export const version = chalk.greenBright.bold(v)

export const analyzeCommandWords = chalk.cyan.bold('Help developer analyze npm packages')
export const depthOptionWords = chalk.yellowBright('The depth of the packages, 3 for tree and 2 for pkgs.json by default')
export const filePathOptionWords = chalk.yellowBright('The path of output file')
export const bothOptionWords = chalk.yellowBright('Generate pkgs.json file and start webSite')

export const cleanCommandWords = chalk.cyan.bold('Clean the files that the website needs')
export const treeCommandWords = chalk.cyan.bold('Generate treePkgs.txt file')

const buildFinished = `
${chalk.cyan.bold('Build Finished!')}
${filePrefix} ${chalk.cyan(resolve('./dist'))}`
export function logBuildFinished(duration: number) {
  console.log(`${buildFinished} \t${chalk.black('ready in')} ${chalk.whiteBright.bold(duration)} ${chalk.black('ms')}\n`)
}

export const distPath = resolve(__dirname, './')
export const devDistPath = resolve(__dirname, '../../web/public/')
