import { resolve } from 'node:path'
import fs from 'node:fs'
import { isEmptyObj } from '@truth-cli/shared'
import type { Relations } from '@truth-cli/shared'

export function useReadDir(p: string) {
  const pkgsRoot = fs.readdirSync(p)
  return pkgsRoot
}

export function useReadFile(p: string) {
  const json = fs.readFileSync(p)
  const pkg = JSON.parse(json.toString())
  return pkg
}

/**
 * `truth-cli` 为了优化读文件的操作，选择了读取文件后形成一个 relations，后续文件的生成都依赖于这个 relations
 * 读取文件的速度很慢，`truth-cli` 只会读取一次(根目录和 node_modules 目录的 package.json)，形成一种对象格式
 * 由于根据对象键值查找时间复杂度为 O(1)，这样效率很大大提升
 */
const { name, version, dependencies, devDependencies, homepage } = useReadFile('package.json')
const relations: Relations = {
  __root__: { version, dependencies, devDependencies, homepage, name: name ?? '__root__' },
}

function dealPkg(p: string) {
  const pkg = useReadFile(p)
  const { name, version, dependencies, devDependencies, homepage } = pkg
  relations[name] = { version, homepage }
  isEmptyObj(dependencies) || (relations[name]!.dependencies = dependencies)
  isEmptyObj(devDependencies) || (relations[name]!.devDependencies = devDependencies)
}

function dealPnpmModules(p: string) {
  const dirs = useReadDir(`${p}/node_modules`)
  for (let i = 0; i < dirs.length; i++) {
    if (dirs[i][0] === '.')
      continue
    const nodePath = `${p}/node_modules/${dirs[i]}`
    // 处理带有 @
    if (dirs[i][0] === '@') {
      const subDirs = useReadDir(nodePath)
      for (let j = 0; j < subDirs.length; j++)
        dealPkg(`${nodePath}/${subDirs[j]}/package.json`)
    }
    else {
      dealPkg(`${nodePath}/package.json`)
    }
  }
}

/**
 * 读取 node_modules 目录下的所有 package.json 文件
 */
function readGlob(p: string) {
  const pkgsRoot = useReadDir(p)
  for (let i = 0; i < pkgsRoot.length; i++) {
    const pkgPath = resolve(p, `${pkgsRoot[i]}`)
    if (pkgsRoot[i][0] === '.' && pkgsRoot[i] !== '.pnpm')
      continue
    // 处理 .pnpm 文件
    if (pkgsRoot[i] === '.pnpm') {
      dealPnpmModules(pkgPath)
    }
    else {
      // 处理带有 @
      if (pkgsRoot[i][0] === '@') {
        const dirs = useReadDir(pkgPath)
        for (let i = 0; i < dirs.length; i++) readGlob(pkgPath)
      }
      else {
        dealPkg(`${pkgPath}/package.json`)
      }
    }
  }
}

export function genRelations() {
  readGlob('node_modules')
  return relations
}
