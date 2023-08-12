import { readFileSync, readdirSync } from 'node:fs'

export function readDir(p: string) {
  const pkgsRoot = readdirSync(p)
  return pkgsRoot
}

export function readFile(p: string) {
  const json = readFileSync(p)
  const pkg = JSON.parse(json.toString())
  return pkg
}
