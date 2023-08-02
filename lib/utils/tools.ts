import fs from 'node:fs/promises'

export async function readDir(p: string) {
  const pkgsRoot = await fs.readdir(p)
  return pkgsRoot
}

export async function readFile(p: string) {
  const json = await fs.readFile(p)
  const pkg = JSON.parse(json.toString())
  return pkg
}

export function assign(...rest: object[]) {
  return Object.assign({}, ...rest)
}

export function entries(obj: object | undefined) {
  return Object.entries(obj ?? {})
}

export function isEmptyObj(obj: object) {
  return JSON.stringify(obj) === '{}'
}
