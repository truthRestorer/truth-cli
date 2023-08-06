import path from 'node:path'
import { isEmptyObj, readDir, readFile } from '@truth-cli/shared'
import type { IRelations } from '@truth-cli/shared'

/**
 * `truth-cli` 为了优化读文件的操作，选择了读取文件后形成一个 relations，后续文件的生成都依赖于这个 relations
 * 读取文件的速度很慢，`truth-cli` 只会读取一次(根目录和 node_modules 目录的 package.json)，形成一种对象格式
 * 由于根据对象键值查找时间复杂度为 O(1)，这样效率很大大提升
 */
export const relations: Partial<IRelations> = {}
/**
 * relation 是否为空，这里空指的是 {} || undefined || null
 */
function dealEmptyRelation(relation: { [key: string]: any } | undefined) {
  return relation && !isEmptyObj(relation)
}
/**
 * 读取根目录和 node_modules 目录下的所有 package.json 文件
 */
async function readGlob(p: string) {
  if (!p.includes('node_modules')) {
    const pkg = (await readFile(p)) as IRelations
    const { name, description, version, dependencies, devDependencies, repository, author, homepage } = pkg
    const rootPkg = {
      name,
      description,
      repository,
      author,
      homepage,
      version,
      devDependencies,
      dependencies,
    }
    relations.__root__ = rootPkg
    relations[name] = rootPkg
    return
  }
  const pkgsRoot = await readDir(p)
  for (let i = 0; i < pkgsRoot.length; i++) {
    const pkgPath = path.resolve(p, `${pkgsRoot[i]}`)
    if (pkgsRoot[i].includes('.'))
      continue
      // 处理带有 @
    if (pkgsRoot[i].startsWith('@')) {
      const dirs = await readDir(pkgPath)
      for (let i = 0; i < dirs.length; i++) await readGlob(pkgPath)
    }
    else {
      const pkg = (await readFile(`${pkgPath}/package.json`)) as IRelations
      const { name, description, version, dependencies, devDependencies, repository, author, homepage } = pkg
      relations[pkg.name] = {
        name, description, version, homepage, repository, author,
      }
      dealEmptyRelation(dependencies) && (relations[pkg.name].dependencies = dependencies)
      dealEmptyRelation(devDependencies) && (relations[pkg.name].devDependencies = devDependencies)
    }
  }
}
/**
 * 导出易于命名行操作的函数
 */
export async function genRelations() {
  await readGlob('package.json')
  await readGlob('node_modules')
  return relations
}
