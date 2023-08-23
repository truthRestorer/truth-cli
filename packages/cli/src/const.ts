/* eslint-disable no-console */
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import {
  bold,
  cyan,
  dim,
  green,
  red,
} from 'picocolors'
import { version } from '../package.json'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

export function logError(message: string) {
  console.log(`\n  ${red('Error')} ${message}\n`)
}

export function logLogo() {
  const logo = `\n  ${green(bold('TRUTH-CLI'))} ${dim(`v${version}`)}\n`
  console.log(logo)
}

export function logWebStart(duration: number, port: number) {
  logLogo()
  console.log(`  ${cyan(`http://localhost:${port}`)}\t ${bold(duration)} ${dim('ms')}\n`)
}

export function logFileWirteFinished(duration: number, file: string) {
  logLogo()
  console.log(`  ${cyan(path.resolve(file))}\t ${dim(duration)}${dim('ms')}\n`)
}

export const htmlPath = path.resolve(__dirname, 'index.html.gz')
