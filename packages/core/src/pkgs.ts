import { PkgDependency, entries, isEmptyObj } from '@truth-cli/shared'
import type { Pkgs, Relations } from '@truth-cli/shared'

// 为了不重复生成的根节点，我们需要 Set 数据结构；当 dep 过大时，pkgSet 会记住所有的节点
const pkgSet = new Set()
/**
 * 向 pkg 中添加节点
 */
function addPkg(
  pkg: Partial<Pkgs> | undefined,
  dependencies: { [key: string]: string } | undefined,
  type: PkgDependency,
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
export function genPkgs(depth: number, relations: Relations) {
  const { devDependencies, dependencies, version } = relations.__root__
  const pkgs: Partial<Pkgs> = {
    name: '__root__',
    version: version ?? 'latest',
    packages: {} as Pkgs,
  }
  addPkg(pkgs, devDependencies, PkgDependency.DEVDEPENDENCY, true)
  addPkg(pkgs, dependencies, PkgDependency.DEPENDENCY, true)
  /**
 * 递归(深度优先)产生 `pkgs.json` 内容数据
 */
  function loadPkgs(rootPkgs: Pkgs | undefined, maxDep: number, shouldOptimize: boolean) {
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
        isEmptyObj(dependencies) || addPkg(rootPkgs[key], dependencies, PkgDependency.DEPENDENCY, shouldOptimize)
        isEmptyObj(devDependencies) || addPkg(rootPkgs[key], devDependencies, PkgDependency.DEVDEPENDENCY, shouldOptimize)
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
