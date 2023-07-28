/* eslint-disable no-console */
import chalk from 'chalk'

const depthError = `
  ${chalk.bgRedBright('Error!') + chalk.redBright(' depth is over 7 or not a number')}
  You should use like this:
  ${chalk.cyan('dep-cli analyze') + chalk.cyanBright('-d 3')}
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
