/* eslint-disable no-console */
// TODO: 完成各种报错以及其他打印语句
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { Chalk } from 'chalk'

const chalk = new Chalk({ level: 3 })
const __dirname = fileURLToPath(new URL('.', import.meta.url))
const __root = path.resolve(__dirname, '..')

const fileWirteError = `
  ${chalk.bgRedBright('Error!')} ${chalk.cyan.yellow('Here is error message')}`
export function logFileWirteError(message: string) {
  console.log(`${fileWirteError}: ${message}`)
}

const depthError = `
  ${chalk.bgRedBright('Error!') + chalk.redBright(' depth is over 7 or not a number')}
  ${chalk.yellow('Detail:')} `
export function logDepthError(message: string) {
  console.log(`${depthError + message}\n`)
}

const notExportPkg = `
  ${chalk.bgYellowBright('Warn:')} ${chalk.yellow('No "exports" main defined in:')}
`
export function LogNotExportPkg(errMsg: string) {
  console.log(`${notExportPkg}\n${errMsg}`)
}

const logo = `
  ${chalk.greenBright.bold('TRUTH-CLI')} ${chalk.greenBright('v0.1.3')}
`
export function logLogo() {
  console.log(logo)
}

const webStart = `  ➜  ${chalk.whiteBright.bold('Local')}: ${chalk.cyan('http://localhost:3002')}\t`
export function logAnalyzeFinish(duration: number) {
  console.log(`${webStart} ${chalk.black('ready in')} ${chalk.whiteBright.bold(duration)} ${chalk.black('ms')}\n`)
}

const fileWriteFinished = `  ➜  ${chalk.whiteBright.bold('File:')}`
export function logFileWirteFinished(duration: number, p: string) {
  console.log(`${fileWriteFinished} ${chalk.cyan(path.resolve(p, './pkgs.json'))}\t${chalk.black('ready in')} ${chalk.whiteBright.bold(duration)} ${chalk.black('ms')}\n`)
}

export const webPath = path.resolve(__root, './dist/web/')
export const devWebPath = path.resolve(__root, '../packages/web/')

export const rootPath = __root
