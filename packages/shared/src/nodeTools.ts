import { readFileSync, readdirSync } from 'node:fs'

export function useReadDir(p: string) {
  const pkgsRoot = readdirSync(p)
  return pkgsRoot
}

export function useReadFile(p: string) {
  const json = readFileSync(p)
  const pkg = JSON.parse(json.toString())
  return pkg
}
