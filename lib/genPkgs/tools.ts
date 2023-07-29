import fs from 'node:fs'

export function readDir(p: string) {
  const pkgsRoot = fs.readdirSync(p)
  return pkgsRoot
}

export function readFile(p: string) {
  const json = fs.readFileSync(p)
  const pkg = JSON.parse(json.toString())
  return pkg
}
