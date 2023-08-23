/* eslint-disable no-console */
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import pc from 'picocolors'
import { version } from '../package.json'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

export function logError(message: string) {
  const commonError = `\n  ${pc.bgRed('Error!')} ${pc.yellow('Here is error message:')}`
  console.log(`${commonError}: ${message}\n`)
}

export function logLogo() {
  const logo = `\n  ${pc.green(pc.bold('TRUTH-CLI'))} ${pc.green(`v${version}`)}\n`
  console.log(logo)
}

export function logWebStart(duration: number, port: number) {
  logLogo()
  const webStart = `  ${pc.white(pc.bold('Local'))}: ${pc.cyan(`http://localhost:${port}`)}\t`
  console.log(`${webStart} ${pc.dim('ready in')} ${pc.white(pc.bold(duration))} ${pc.dim('ms')}\n`)
}

export function logFileWirteFinished(duration: number, p: string, fileType: 'json' | 'txt') {
  logLogo()
  console.log(`  ${pc.white(pc.bold('File:'))}: ${pc.cyan(path.resolve(p, `./pkgs.${fileType}`))}\t${pc.dim('ready in')} ${pc.white(pc.bold(duration))} ${pc.dim('ms')}\n`)
}

export const depOpts = () => 'The depth of the packages, 3 for tree and 2 for pkgs.json by default'
export const pathOpts = () => 'The path of output file'
export const treeCmd = () => 'Generate pkgs.txt file'

export const htmlPath = path.resolve(__dirname, 'index.html.gz')
