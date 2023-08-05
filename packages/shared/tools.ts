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

/**
 * 处理依赖路径，\\转换成/，提取第一个node_modules之后的
 * @param path
 */
export function transPath(path: string) {
  const regPath = path.match(/node_modules(.*)/)
  return regPath ? regPath[0].replace(/\\/g, '/') : ''
}
