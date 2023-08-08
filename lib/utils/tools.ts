import { readdir, readFile as readfile } from 'node:fs/promises'

export async function readDir(p: string) {
  const pkgsRoot = await readdir(p)
  return pkgsRoot
}

export async function readFile(p: string) {
  const json = await readfile(p)
  const pkg = JSON.parse(json.toString())
  return pkg
}
