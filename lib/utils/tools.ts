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

export function entries(obj: object | undefined | null) {
  return Object.entries(obj ?? {})
}

export function isEmptyObj(obj: object | undefined | null) {
  return JSON.stringify(obj) === '{}' || obj === undefined || obj === null
}
