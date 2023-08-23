/* eslint-disable no-console */
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import pc from 'picocolors'
import { description as c, version as v } from '../package.json'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

export function logError(message: string) {
  const commonError = `\n  ${pc.bgRed('Error!')} ${pc.yellow('Here is error message:')}`
  console.log(`${commonError}: ${message}\n`)
}

export function logLogo() {
  const logo = `\n  ${pc.green(pc.bold('TRUTH-CLI'))} ${pc.green(`v${v}`)}\n`
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

export function logRedload(times: number) {
  const date = new Date()
  const hh = date.getHours()
  const mm = date.getMinutes()
  const ss = date.getSeconds()
  const reloadWords = `${pc.dim(`${hh}:${mm}:${ss}`)} ${pc.cyan(pc.bold('[truth-cli]'))} ${pc.dim('reload')} ${times ? '' : pc.yellow(pc.bold(`x${times}`))}`
  console.log(reloadWords)
}

export const description = pc.cyan(pc.bold(c))
export const version = pc.green(pc.bold(v))

export const analyzeCommandWords = pc.cyan(pc.bold('Help developer analyze npm packages'))
export const depthOptionWords = pc.yellow('The depth of the packages, 3 for tree and 2 for pkgs.json by default')
export const filePathOptionWords = pc.yellow('The path of output file')

export const treeCommandWords = pc.cyan(pc.bold('Generate pkgs.txt file'))

export const htmlPath = path.resolve(__dirname, 'index.html.gz')
