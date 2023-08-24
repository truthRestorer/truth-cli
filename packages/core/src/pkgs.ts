import { isEmptyObj } from '@truth-cli/shared'
import type { Relations } from '@truth-cli/shared'

export function useEntries(obj: object | undefined | null) {
  return Object.entries(obj ?? {})
}

enum PkgDependency {
  'DEVDEPENDENCY',
  'DEPENDENCY',
}

export interface Pkgs {
  version?: string
  type?: PkgDependency
  packages?: Pkgs
  [key: string]: any
}

export function genPkgs(depth: number, relations: Relations, shouldOptimize = false) {
  // 为了不重复生成的根节点，我们需要 Set 数据结构
  const pkgSet = new Set()
  const { devDependencies, dependencies, version = 'latest' } = relations.__root__
  const pkgs: Pkgs = {
    name: '__root__',
    version,
    packages: {},
  }
  pkgs.packages = getPackages(dependencies, devDependencies)
  // 向 pkg 中添加节点
  function getPackages(
    dependencies: { [key: string]: string } | undefined,
    devDependencies: { [key: string]: string } | undefined,
  ) {
    // FIXME: 这个逻辑似乎有点麻烦了，可以尝试简化一下
    const pkgs: Pkgs = {}
    for (const [name, version] of useEntries(dependencies)) {
      const add = { version, type: PkgDependency.DEPENDENCY }
      pkgs[name] = pkgSet.has(name) ? add : { ...add, packages: {} }
    }
    for (const [name, version] of useEntries(devDependencies)) {
      const add = { version, type: PkgDependency.DEVDEPENDENCY }
      pkgs[name] = pkgSet.has(name) ? add : { ...add, packages: {} }
    }
    return pkgs
  }
  if (!shouldOptimize)
    shouldOptimize = depth > 4
  // 递归(深度优先)产生 `pkgs.json` 内容数据
  function loadPkgs(rootPkgs: Pkgs, maxDep: number) {
    if (maxDep <= 0) {
      for (const key of Object.keys(rootPkgs))
        delete rootPkgs[key].packages
      return
    }
    for (const key of Object.keys(rootPkgs)) {
      pkgSet.add(key)
      const { dependencies, devDependencies } = relations[key] ?? {}
      rootPkgs[key].packages = getPackages(dependencies, devDependencies)
      if (isEmptyObj(rootPkgs[key].packages))
        delete rootPkgs[key].packages
      else
        loadPkgs(rootPkgs[key].packages, maxDep - 1)
      shouldOptimize || pkgSet.delete(key)
    }
  }
  loadPkgs(pkgs.packages, depth - 1)
  return pkgs
}
