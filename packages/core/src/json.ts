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
  for (const [name, version] of useEntries(devDependencies))
    pkgs.packages![name] = { version, type: PkgDependency.DEVDEPENDENCY, packages: {} }
  for (const [name, version] of useEntries(dependencies))
    pkgs.packages![name] = { version, type: PkgDependency.DEPENDENCY, packages: {} }
  if (!shouldOptimize)
    shouldOptimize = depth > 4
  // 递归(深度优先)产生 `pkgs.json` 内容数据
  function loadJson(rootPkgs: PkgJson | undefined, maxDep: number) {
    if (!rootPkgs)
      return
    if (maxDep <= 0) {
      for (const key of Object.keys(rootPkgs))
        delete rootPkgs[key].packages
      return
    }
    for (const key of Object.keys(rootPkgs)) {
      if (!rootPkgs[key].packages)
        continue
      const { dependencies, devDependencies } = relations[key] ?? {}
      pkgSet.add(key)
      for (const [name, version] of useEntries(dependencies)) {
        rootPkgs[key].packages[name] = { version, type: PkgDependency.DEPENDENCY }
        pkgSet.has(name) || (rootPkgs[key].packages[name].packages = {})
      }
      for (const [name, version] of useEntries(devDependencies)) {
        rootPkgs[key].packages[name] = { version, type: PkgDependency.DEVDEPENDENCY }
        pkgSet.has(name) || (rootPkgs[key].packages[name].packages = {})
      }
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
