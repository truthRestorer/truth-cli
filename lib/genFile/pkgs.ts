import { entries, isEmptyObj } from '../utils/tools.js'
import { EDep } from '../utils/types.js'
import type { IPkgs } from '../utils/types.js'
import { relations, rootPkg, rootPkgSet } from './relations.js'

// 为了不重复生成的根节点，我们需要 Set 数据结构；当 dep 过大时，pkgSet 会记住所有的节点
const pkgSet = new Set()

/**
 * 向 pkg 中添加节点
 */
function addPkg(
  pkg: IPkgs | undefined,
  dependencies: IPkgs | undefined,
  type: EDep,
  shouldOptimize: boolean,
) {
  if (
    !dependencies
    || isEmptyObj(dependencies)
    || !pkg?.packages
  )
    return
  for (const [name, version] of entries(dependencies)) {
    if (!pkgSet.has(name) && !rootPkgSet.has(name)) {
      shouldOptimize && pkgSet.add(name)
      pkg.packages[name] = { version, type, packages: {} }
    }
    else {
      pkg.packages[name] = {}
    }
  }
}

/**
 * 递归(深度优先)产生 `pkgs.json` 内容数据
 */
function loadPkgs(
  rootPkgs: IPkgs | undefined,
  maxDep: number,
  shouldOptimize: boolean,
) {
  if (rootPkgs === undefined)
    return
  if (maxDep === 0) {
    for (const key of Object.keys(rootPkgs))
      delete rootPkgs[key].packages
    return
  }
  for (const key of Object.keys(rootPkgs)) {
    if (!key.startsWith('.')) {
      pkgSet.add(key)
      const { dependencies, devDependencies } = relations[key] ?? {}
      addPkg(rootPkgs[key], dependencies, EDep.DEPENDENCY, shouldOptimize)
      addPkg(rootPkgs[key], devDependencies, EDep.DEVDEPENDENCY, shouldOptimize)
      if (isEmptyObj(rootPkgs[key].packages))
        delete rootPkgs[key].packages
      loadPkgs(rootPkgs[key].packages, maxDep - 1, shouldOptimize)
      !shouldOptimize && pkgSet.delete(key)
    }
  }
}
/**
 * 便于命令行操作的生成文件函数
 */
export async function genPkgs(depth: number) {
  const pkgs: IPkgs = {}
  const { devDependencies, dependencies } = rootPkg.__root__
  for (const [name, version] of entries(devDependencies) as any)
    pkgs[name] = { version, type: EDep.DEVDEPENDENCY, packages: {} }
  for (const [name, version] of entries(dependencies) as any)
    pkgs[name] = { version, type: EDep.DEPENDENCY, packages: {} }
  loadPkgs(pkgs, depth, depth > 3)
  return pkgs
}