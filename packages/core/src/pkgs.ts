import { EDep, entries, isEmptyObj } from '@truth-cli/shared'
import type { IPkgs, IRelations } from '@truth-cli/shared'

// 为了不重复生成的根节点，我们需要 Set 数据结构；当 dep 过大时，pkgSet 会记住所有的节点
const pkgSet = new Set<string>()
/**
 * 向 pkg 中添加节点
 */
function addPkg(
  pkg: IPkgs | undefined,
  dependencies: { [key: string]: string } | undefined,
  type: EDep,
  shouldOptimize: boolean,
) {
  if (dependencies && pkg?.packages) {
    for (const [name, version] of entries(dependencies)) {
      if (pkgSet.has(name)) {
        pkg!.packages[name] = { version, type }
      }
      else {
        shouldOptimize && pkgSet.add(name)
        pkg!.packages[name] = { version, type, packages: {} }
      }
    }
  }
}

/**
 * 便于命令行操作的生成文件函数
 */
export function genPkgs(depth: number, relations: IRelations) {
  const { devDependencies, dependencies, version } = relations.__root__
  const pkgs: any = {
    name: '__root__',
    version,
    packages: {},
  }
  addPkg(pkgs, devDependencies, EDep.DEVDEPENDENCY, true)
  addPkg(pkgs, dependencies, EDep.DEPENDENCY, true)
  /**
 * 递归(深度优先)产生 `pkgs.json` 内容数据
 */
  function loadPkgs(rootPkgs: IPkgs | undefined, maxDep: number, shouldOptimize: boolean) {
    if (rootPkgs === undefined)
      return
    if (maxDep <= 0) {
      for (const key of Object.keys(rootPkgs))
        delete rootPkgs[key].packages
      return
    }
    for (const key of Object.keys(rootPkgs)) {
      if (!key.startsWith('.')) {
        pkgSet.add(key)
        const { dependencies, devDependencies } = relations[key] ?? {}
        isEmptyObj(dependencies) || addPkg(rootPkgs[key], dependencies, EDep.DEPENDENCY, shouldOptimize)
        isEmptyObj(devDependencies) || addPkg(rootPkgs[key], devDependencies, EDep.DEVDEPENDENCY, shouldOptimize)
        if (isEmptyObj(rootPkgs[key].packages))
          delete rootPkgs[key].packages
        loadPkgs(rootPkgs[key].packages, maxDep - 1, shouldOptimize)
        shouldOptimize || pkgSet.delete(key)
      }
    }
  }
  loadPkgs(pkgs.packages, depth - 1, depth > 4)
  return pkgs
}
