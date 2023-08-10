import type { IVersions } from '@truth-cli/shared'
import { assign, entries, isEmptyObj } from '@truth-cli/shared'
import { relations } from './relations.js'

const versions: IVersions = {}

export function vControl(v: string) {
  if (v[0] === '^')
    return v.slice(0, v.indexOf('.'))
  if (v[0] === '~')
    return v.slice(0, v.lastIndexOf('.'))
  return v
}

function loadVersions() {
  for (const { dependencies, devDependencies, name } of Object.values(relations)) {
    const pkgs = assign(dependencies, devDependencies)
    if (!isEmptyObj(pkgs)) {
      for (const [pkgName, pkgVersion] of entries(pkgs)) {
        const pkgMap = versions[pkgName]
        const v = vControl(pkgVersion)
        if (!pkgMap) {
          versions[pkgName] = {}
          versions[pkgName][v] = [name]
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
}

export async function genVersions() {
  loadVersions()
  for (const key of Object.keys(versions)) {
    if (Object.keys(versions[key]).length === 1)
      delete versions[key]
  }
  return versions
}
