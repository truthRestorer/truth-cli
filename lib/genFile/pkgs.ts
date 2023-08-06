import { EDep, entries, isEmptyObj } from '@truth-cli/shared'
import type { IPkgs } from '@truth-cli/shared'
import { relations } from './relations.js'

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
      isEmptyObj(dependencies) || addPkg(rootPkgs[key], dependencies, EDep.DEPENDENCY, shouldOptimize)
      isEmptyObj(devDependencies) || addPkg(rootPkgs[key], devDependencies, EDep.DEVDEPENDENCY, shouldOptimize)
      if (isEmptyObj(rootPkgs[key].packages))
        delete rootPkgs[key].packages
      loadPkgs(rootPkgs[key].packages, maxDep - 1, shouldOptimize)
      shouldOptimize || pkgSet.delete(key)
    }
  }
}
/**
 * 便于命令行操作的生成文件函数
 */
export function genPkgs(depth: number) {
  const { devDependencies, dependencies, name, version } = relations.__root__
  const pkgs: IPkgs = {
    name,
    version,
    type: EDep.DEPENDENCY,
    packages: {} as IPkgs,
  }
  addPkg(pkgs, devDependencies, EDep.DEVDEPENDENCY, true)
  addPkg(pkgs, dependencies, EDep.DEPENDENCY, true)
  loadPkgs(pkgs.packages, depth, depth > 3)
  return pkgs
}
