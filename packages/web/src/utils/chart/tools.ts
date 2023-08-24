import type { Relations } from '@truth-cli/shared'

export function getCirculation(name: string, relations: Relations) {
  if (!relations[name])
    return
  const { devDependencies, dependencies = {} } = relations[name]
  const pkgs = Object.assign(dependencies, devDependencies)
  const result = []
  for (const pkg of Object.keys(pkgs)) {
    if (relations[pkg]) {
      const { devDependencies = {}, dependencies } = relations[pkg]
      const relationPkg = Object.assign(devDependencies, dependencies)
      if (Object.keys(relationPkg).includes(name))
        result.push(pkg)
    }
  }
  return result.length ? result : undefined
}

export function fuzzySearch(name: string, relations: Relations) {
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

export function keyOfPkg(dependencies: object, devDependencies?: object) {
  return Object.keys(Object.assign(dependencies, devDependencies))
}
