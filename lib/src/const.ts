/* eslint-disable no-console */
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { Chalk } from 'chalk'

const chalk = new Chalk({ level: 3 })
const __dirname = fileURLToPath(new URL('.', import.meta.url))
const __root = path.resolve(__dirname, '..')

const depthError = `
  ${chalk.bgRedBright('Error!') + chalk.redBright(' depth is over 7 or not a number')}
  You should use like this:
  ${chalk.cyan('dep-cli analyze ') + chalk.cyanBright('-d 3')}
`
export function logDepthError() {
  console.log(depthError)
}

const notExportPkg = `
  ${chalk.bgYellowBright('Warn:')} + ${chalk.yellow('No "exports" main defined in:')}
`
export function LogNotExportPkg(errMsg: string) {
  console.log(`${notExportPkg}\n${errMsg}`)
}

const webStart = `
  ${chalk.greenBright.bold('TRUTH-CLI v1.0.0')} ready
  Local: ${chalk.cyan('http://localhost:3002')}
`
export function logWebStart() {
  console.log(webStart)
}

export const webPath = path.resolve(__root, './dist/web/')
