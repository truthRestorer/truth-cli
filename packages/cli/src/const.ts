/* eslint-disable no-console */
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import {
  bgRed,
  bold,
  cyan,
  dim,
  green,
  white,
  yellow,
} from 'picocolors'
import { version } from '../package.json'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

export function logError(message: string) {
  const commonError = `\n  ${bgRed('Error!')} ${yellow('Here is error message:')}`
  console.log(`${commonError}: ${message}\n`)
}

export function logLogo() {
  const logo = `\n  ${green(bold('TRUTH-CLI'))} ${green(`v${version}`)}\n`
  console.log(logo)
}

export function logWebStart(duration: number, port: number) {
  logLogo()
  const webStart = `  ${white(bold('Local'))}: ${cyan(`http://localhost:${port}`)}\t`
  console.log(`${webStart} ${dim('ready in')} ${white(bold(duration))} ${dim('ms')}\n`)
}

export function logFileWirteFinished(duration: number, p: string, fileType: 'json' | 'txt') {
  logLogo()
  console.log(`  ${white(bold('File:'))}: ${cyan(path.resolve(p, `./pkgs.${fileType}`))}\t${dim('ready in')} ${white(bold(duration))} ${dim('ms')}\n`)
}

export const htmlPath = path.resolve(__dirname, 'index.html.gz')
