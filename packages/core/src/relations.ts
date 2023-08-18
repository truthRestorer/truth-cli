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

export function genRelations() {
  const { name, version, dependencies, devDependencies, homepage } = useReadFile('package.json')
  const relations: Relations = {
    __root__: { version, dependencies, devDependencies, homepage, name: name ?? '__root__' },
  }
  /**
   * 读取 node_modules 目录下的所有 package.json 文件
   */
  function readGlob(p: string) {
    const dirs = useReadDir(p)
    for (let i = 0; i < dirs.length; i++) {
      const pkgPath = resolve(p, `${dirs[i]}`)
      if ((dirs[i][0] === '.' || dirs[i] === 'lock.yaml') && dirs[i] !== '.pnpm')
        continue
      if (fs.existsSync(`${pkgPath}/package.json`)) {
        const pkg = useReadFile(`${pkgPath}/package.json`)
        const { name, version, dependencies, devDependencies, homepage } = pkg
        relations[name] = { version, homepage }
        isEmptyObj(dependencies) || (relations[name]!.dependencies = dependencies)
        isEmptyObj(devDependencies) || (relations[name]!.devDependencies = devDependencies)
      }
      else {
        readGlob(pkgPath)
      }
    }
  }
  readGlob('node_modules')
  return relations
}
