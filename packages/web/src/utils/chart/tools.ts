import type { Relations } from '@truth-cli/shared'
import { useAssign } from '@truth-cli/shared'
import { genVersions } from '@truth-cli/core'
import type { PkgInfo } from '../../types'

function getCirculation(name: string, relations: Relations) {
  if (!relations[name])
    return
  const { devDependencies, dependencies } = relations[name]
  const pkgs = useAssign(devDependencies, dependencies)
  const result = []
  for (const pkg of Object.keys(pkgs)) {
    if (relations[pkg]) {
      const { devDependencies, dependencies } = relations[pkg]
      const relationPkg = useAssign(devDependencies, dependencies)
      if (Object.keys(relationPkg).includes(name))
        result.push(pkg)
    }
  }
  return result.length ? result : undefined
}

function fuzzySearch(name: string, relations: Relations) {
  const relatedPkg = relations[name]
  if (relatedPkg) {
    return {
      relatedPkg,
      relatedName: name,
    }
  }
  const findPkgKey = Object.keys(relations).find((key) => {
    return key.toLowerCase().includes(name.toLowerCase())
  })
  if (!findPkgKey)
    return {}
  return {
    relatedPkg: relations[findPkgKey],
    relatedName: findPkgKey,
  }
}

export function getPkgInfo(name: string, relations: Relations): PkgInfo {
  const versions = genVersions(relations)
  const { relatedPkg, relatedName } = fuzzySearch(name, relations)
  return {
    __info__: relatedName ? { name: relatedName, ...relatedPkg } : undefined,
    __circulation__: getCirculation?.(name, relations),
    __versions__: versions?.[name],
  }
}
