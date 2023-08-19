/* eslint-disable no-console */
import { fileURLToPath } from 'node:url'
import { resolve } from 'node:path'
import { Chalk } from 'chalk'
import { description as c, version as v } from '../package.json'

const chalk = new Chalk({ level: 3 })
const __dirname = fileURLToPath(new URL('.', import.meta.url))

const errorPrefix = chalk.bgRedBright('Error!')
const localPrefix = `➜  ${chalk.whiteBright.bold('Local')}:`
const filePrefix = `➜  ${chalk.whiteBright.bold('File:')}:`

const commonError = `  ${errorPrefix} ${chalk.cyan.yellow('Here is error message:')}`
export function logCommonError(message: string) {
  console.log(`${commonError}: ${message}\n`)
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

export function logFileWirteFinished(duration: number, p: string, fileType: 'json' | 'txt') {
  console.log(`  ${filePrefix} ${chalk.cyan(resolve(p, `./pkgs.${fileType}`))}\t${chalk.black('ready in')} ${chalk.whiteBright.bold(duration)} ${chalk.black('ms')}\n`)
}

export const description = chalk.cyan.bold(c)
export const version = chalk.greenBright.bold(v)

export const analyzeCommandWords = chalk.cyan.bold('Help developer analyze npm packages')
export const depthOptionWords = chalk.yellowBright('The depth of the packages, 3 for tree and 2 for pkgs.json by default')
export const filePathOptionWords = chalk.yellowBright('The path of output file')

export const treeCommandWords = chalk.cyan.bold('Generate pkgs.txt file')

export const distPath = resolve(__dirname, './')
