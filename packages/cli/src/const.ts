/* eslint-disable no-console */
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { version } from '../package.json'
import colors from './colors.js'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

export function logError(message: string) {
  console.log(`\n  ${colors.red('Error')} ${message}\n`)
}

export const v = colors.dim(`v${version}`)

function logLogo() {
  const logo = `\n  ${colors.green(colors.bold('TRUTH-CLI'))} ${v}\n`
  console.log(logo)
}

export function logFinished(duration: number, extra: number | string) {
  logLogo()
  const prefix = `  ${
    colors.cyan(
      typeof extra === 'string'
      ? path.resolve(extra)
      : `http://localhost:${extra}`)
  }`
  console.log(`${prefix}   ${colors.bold(duration)} ${colors.dim('ms')}\n`)
}

export const htmlPath = path.resolve(__dirname, 'index.html.br')
