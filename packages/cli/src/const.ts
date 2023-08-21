/* eslint-disable no-console */
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { Chalk } from 'chalk'
import { description as c, version as v } from '../package.json'

const chalk = new Chalk({ level: 3 })
const __dirname = fileURLToPath(new URL('.', import.meta.url))

const errorPrefix = chalk.bgRedBright('Error!')

export function logCommonError(message: string) {
  const commonError = `  ${errorPrefix} ${chalk.cyan.yellow('Here is error message:')}`
  console.log(`${commonError}: ${message}\n`)
}

export function logDepthError() {
  const depthError = `\n  ${errorPrefix} ${chalk.redBright('illegal type of depth')}`
  console.log(`${depthError}\n`)
}

export function logLogo() {
  const logo = `\n  ${chalk.greenBright.bold('TRUTH-CLI')} ${chalk.greenBright(`v${v}`)}\n`
  console.log(logo)
}

export function logWebStart(duration: number) {
  const webStart = `  ➜  ${chalk.whiteBright.bold('Local')}: ${chalk.cyan('http://localhost:3002')}\t`
  console.log(`${webStart} ${chalk.black('ready in')} ${chalk.whiteBright.bold(duration)} ${chalk.black('ms')}\n`)
}

export function logFileWirteFinished(duration: number, p: string, fileType: 'json' | 'txt') {
  console.log(`  ➜  ${chalk.whiteBright.bold('File:')}: ${chalk.cyan(path.resolve(p, `./pkgs.${fileType}`))}\t${chalk.black('ready in')} ${chalk.whiteBright.bold(duration)} ${chalk.black('ms')}\n`)
}

export const description = chalk.cyan.bold(c)
export const version = chalk.greenBright.bold(v)

export const analyzeCommandWords = chalk.cyan.bold('Help developer analyze npm packages')
export const depthOptionWords = chalk.yellowBright('The depth of the packages, 3 for tree and 2 for pkgs.json by default')
export const filePathOptionWords = chalk.yellowBright('The path of output file')

export const treeCommandWords = chalk.cyan.bold('Generate pkgs.txt file')

export const htmlPath = path.resolve(__dirname, 'index.html.gz')
