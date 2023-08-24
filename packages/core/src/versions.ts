import type { Relations, Versions } from '@truth-cli/shared'
import { isEmptyObj } from '@truth-cli/shared'

export function vControl(v: string) {
  if (v[0] === '^')
    return v.slice(0, v.indexOf('.'))
  if (v[0] === '~')
    return v.slice(0, v.lastIndexOf('.'))
  return v
}

export function genVersions(relations: Relations) {
  const versions: Versions = {}
  function loadVersions() {
    for (const [name, { dependencies = {}, devDependencies = {} }] of Object.entries(relations)) {
      const pkgs = Object.assign(dependencies, devDependencies)
      if (isEmptyObj(pkgs))
        continue
      for (const [pkgName, pkgVersion] of Object.assign(pkgs)) {
        const pkgMap: any = versions[pkgName]
        const v = vControl(pkgVersion)
        if (!pkgMap) {
          versions[pkgName] = { [v]: [name] }
        }
        else {
          if (pkgMap[v] && !pkgMap[v].includes(name))
            pkgMap[v].push(name)
          else
            pkgMap[v] = [name]
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
