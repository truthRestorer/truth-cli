/* eslint-disable no-console */
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { version } from '../package.json'
import colors from './colors.js'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

export function logError(message: string) {
  console.log(`\n  ${colors.red('Error')} ${message}\n`)
}

function logLogo() {
  const logo = `\n  ${colors.green(colors.bold('TRUTH-CLI'))} ${colors.dim(`v${version}`)}\n`
  console.log(logo)
}

export function logFinished(duration: number, extra: number | string) {
  logLogo()
  const prefix = `  ${colors.cyan(typeof extra === 'string' ? path.resolve(extra) : `http://localhost:${extra}`)}`
  console.log(`${prefix}   ${colors.bold(duration)} ${colors.dim('ms')}\n`)
}

export const depOption = 'depth of dependency, [1]'
export const pathOption = 'path of file, ["./"]'
export const htmlPath = path.resolve(__dirname, 'index.html.br')
export const workPath = path.resolve(__dirname, 'assets/worker.js.br')
