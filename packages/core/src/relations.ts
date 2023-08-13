import { resolve } from 'node:path'
import { isEmptyObj, readDir, readFile } from '@truth-cli/shared'
import type { IRelations } from '@truth-cli/shared'

/**
 * `truth-cli` 为了优化读文件的操作，选择了读取文件后形成一个 relations，后续文件的生成都依赖于这个 relations
 * 读取文件的速度很慢，`truth-cli` 只会读取一次(根目录和 node_modules 目录的 package.json)，形成一种对象格式
 * 由于根据对象键值查找时间复杂度为 O(1)，这样效率很大大提升
 */
export const relations: Partial<IRelations> = {}
/**
 * 读取 node_modules 目录下的所有 package.json 文件
 */
function readGlob(p: string) {
  const pkgsRoot = readDir(p)
  for (let i = 0; i < pkgsRoot.length; i++) {
    const pkgPath = resolve(p, `${pkgsRoot[i]}`)
    if (pkgsRoot[i][0] === '.')
      continue
      // 处理带有 @
    if (pkgsRoot[i][0] === '@') {
      const dirs = readDir(pkgPath)
      for (let i = 0; i < dirs.length; i++) readGlob(pkgPath)
    }
    else {
      const pkg: IRelations = readFile(`${pkgPath}/package.json`)
      const { name, description, version, dependencies, devDependencies, repository, author, homepage } = pkg
      relations[pkg.name] = {
        name, description, version, homepage, repository, author,
      }
      isEmptyObj(dependencies) || (relations[pkg.name].dependencies = dependencies)
      isEmptyObj(devDependencies) || (relations[pkg.name].devDependencies = devDependencies)
    }
  }
}
/**
 * 导出易于命名行操作的函数
 */
export function genRelations() {
  const pkg: IRelations = readFile('package.json')
  relations.__root__ = pkg
  readGlob('node_modules')
  return relations
}
