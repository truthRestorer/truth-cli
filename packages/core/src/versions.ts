import type { IRelations, IVersions } from '@truth-cli/shared'
import { assign, entries, isEmptyObj } from '@truth-cli/shared'

const versions: IVersions = {}

export function vControl(v: string) {
  if (v[0] === '^')
    return v.slice(0, v.indexOf('.'))
  if (v[0] === '~')
    return v.slice(0, v.lastIndexOf('.'))
  return v
}

export function genVersions(relations: IRelations) {
  function loadVersions() {
    for (const [name, { dependencies, devDependencies }] of Object.entries(relations)) {
      if (name === '__extra__')
        continue
      const pkgs = assign(dependencies, devDependencies)
      if (!isEmptyObj(pkgs)) {
        for (const [pkgName, pkgVersion] of entries(pkgs)) {
          const pkgMap: any = versions[pkgName]
          const v = vControl(pkgVersion)
          if (!pkgMap) {
            versions[pkgName] = {}
            versions[pkgName][v] = (name ?? '__root__') as any
          }
          else {
            if (pkgMap[v] && !pkgMap[v].includes(name)) {
              if (Array.isArray(pkgMap[v]))
                pkgMap[v].push(name)
              else
                pkgMap[v] = [pkgMap[v], name]
            }
            else {
              pkgMap[v] = name
            }
          }
        }
      }
    }
  }
  loadVersions()
  for (const key of Object.keys(versions)) {
    if (Object.keys(versions[key]).length === 1)
      delete versions[key]
  }
  return versions
}
