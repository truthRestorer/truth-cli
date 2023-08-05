import { assign, entries, isEmptyObj } from '@truth-cli/shared'
import { relations } from './relations'

const versionMap: { [key: string]: any } = {}

function vControl(version: string) {
  if (version.startsWith('^'))
    return version.slice(0, 2)
  else if (version.startsWith('~'))
    return version.slice(0, 4)
  return version
}

function loadVersions() {
  for (const { dependencies, devDependencies, name } of Object.values(relations)) {
    const pkgs = assign(dependencies, devDependencies)
    if (!isEmptyObj(pkgs)) {
      for (const [pkgName, pkgVersion] of entries(pkgs)) {
        const pkgMap = versionMap[pkgName]
        const v = vControl(pkgVersion)
        if (!pkgMap) {
          versionMap[pkgName] = {}
          versionMap[pkgName][v] = [name]
        }
        else {
          if (pkgMap[v])
            versionMap[pkgName][v].push(name)
          else
            pkgMap[v] = [name]
        }
      }
    }
  }
}

export async function genVersions() {
  loadVersions()
  for (const key of Object.keys(versionMap)) {
    if (Object.keys(versionMap[key]).length === 1)
      delete versionMap[key]
  }
  return versionMap
}
