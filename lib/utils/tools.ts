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

export function isNumber(payload: any) {
  return typeof payload !== 'object' && !Number.isNaN(+payload)
}
