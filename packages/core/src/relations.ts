import { resolve } from 'node:path'
import fs from 'node:fs'
import { isEmptyObj } from '@truth-cli/shared'
import type { Relation, Relations } from '@truth-cli/shared'

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
const { version, dependencies, devDependencies, homepage } = useReadFile('package.json')
const relations: Relations = {
  __root__: { version, dependencies, devDependencies, homepage },
  __extra__: {},
}

function dealMultiVersions(p: string, rootName: string) {
  const pkg = useReadFile(p)
  const { name, version, dependencies, devDependencies, homepage } = pkg
  const pkgName = `${name}__${version}`
  relations.__extra__[pkgName] = { version, homepage, related: rootName }
  isEmptyObj(dependencies) || (relations.__extra__[pkgName]!.dependencies = dependencies)
  isEmptyObj(devDependencies) || (relations.__extra__[pkgName]!.devDependencies = devDependencies)
}
/**
 * 读取 node_modules 目录下的所有 package.json 文件
 */
function readGlob(p: string) {
  const pkgsRoot = useReadDir(p)
  for (let i = 0; i < pkgsRoot.length; i++) {
    const pkgPath = resolve(p, `${pkgsRoot[i]}`)
    if (pkgsRoot[i][0] === '.')
      continue
      // 处理带有 @
    if (pkgsRoot[i][0] === '@') {
      const dirs = useReadDir(pkgPath)
      for (let i = 0; i < dirs.length; i++) readGlob(pkgPath)
    }
    else {
      const pkg: Relation = useReadFile(`${pkgPath}/package.json`)
      const { name, version, dependencies, devDependencies, homepage } = pkg
      relations[pkg.name] = { version, homepage }
      isEmptyObj(dependencies) || (relations[pkg.name].dependencies = dependencies)
      isEmptyObj(devDependencies) || (relations[pkg.name].devDependencies = devDependencies)
      if (fs.existsSync(`${pkgPath}/node_modules`)) {
        const dirs = useReadDir(`${pkgPath}/node_modules`)
        for (let i = 0; i < dirs.length; i++) {
          if (dirs[i][0] === '.')
            continue
          const nodePath = `${pkgPath}/node_modules/${dirs[i]}`
          // 处理带有 @
          if (dirs[i][0] === '@') {
            const subDirs = useReadDir(nodePath)
            for (let j = 0; j < subDirs.length; j++) dealMultiVersions(`${nodePath}/${subDirs[j]}/package.json`, name)
          }
          else {
            dealMultiVersions(`${nodePath}/package.json`, name)
          }
        }
      }
    }
  }
}

export function genRelations() {
  readGlob('node_modules')
  return relations
}
