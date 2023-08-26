import { isEmptyObj } from '@truth-cli/shared'
import type { Relations } from '@truth-cli/shared'

export function useEntries(obj: object | undefined | null) {
  return Object.entries(obj ?? {})
}

enum PkgDependency {
  'DEVDEPENDENCY',
  'DEPENDENCY',
}

export interface PkgJson {
  version?: string
  type?: PkgDependency
  packages?: PkgJson
  [key: string]: any
}

export function genJson(depth: number, relations: Relations, shouldOptimize = false) {
  // 为了不重复生成的根节点，我们需要 Set 数据结构
  const pkgSet = new Set()
  const { devDependencies, dependencies, version = 'latest' } = relations.__root__
  const pkgs: PkgJson = {
    name: '__root__',
    version,
    packages: {},
  }
  pkgs.packages = getPackages(dependencies, devDependencies)
  // 向 pkg 中添加节点
  function getPackages(dependencies: any, devDependencies: any) {
    // FIXME: 这个逻辑似乎有点麻烦了，可以尝试简化一下，shouldOptimize 为 true 时，第一次出现不一定包含依赖
    const pkgs: PkgJson = {}
    for (const [name, version] of useEntries(dependencies)) {
      if (!pkgSet.has(name))
        pkgs[name] = { version, type: PkgDependency.DEPENDENCY, packages: {} }
    }
    for (const [name, version] of useEntries(devDependencies)) {
      if (!pkgSet.has(name))
        pkgs[name] = { version, type: PkgDependency.DEVDEPENDENCY, packages: {} }
    }
    return pkgs
  }
  if (!shouldOptimize)
    shouldOptimize = depth > 4
  // 递归(深度优先)产生 `pkgs.json` 内容数据
  function loadJson(rootPkgs: PkgJson, maxDep: number) {
    if (maxDep <= 0) {
      for (const key of Object.keys(rootPkgs))
        delete rootPkgs[key].packages
      return
    }
    for (const key of Object.keys(rootPkgs)) {
      const { dependencies, devDependencies } = relations[key] ?? {}
      rootPkgs[key].packages = getPackages(dependencies, devDependencies)
      pkgSet.add(key)
      if (isEmptyObj(rootPkgs[key].packages))
        delete rootPkgs[key].packages
      else
        loadJson(rootPkgs[key].packages, maxDep - 1)
      shouldOptimize || pkgSet.delete(key)
    }
  }
  loadJson(pkgs.packages, depth - 1)
  return pkgs
}
