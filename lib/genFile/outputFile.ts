import fs from 'node:fs/promises'
import path from 'node:path'
import { entries, isEmptyObj } from '../utils/tools.js'
import { EDep } from '../utils/types.js'
import type { IPkgs } from '../utils/types.js'
import { LogNotExportPkg, logFileWirteError, logFileWirteFinished, logLogo } from '../utils/const.js'
import { relations, rootPkg, rootPkgSet } from './relations.js'

const pkgSet = new Set()

function addPkg(
  pkg: IPkgs | undefined,
  dependencies: IPkgs | undefined,
  type: EDep,
  shouldOptimize: boolean,
) {
  if (
    !dependencies
    || isEmptyObj(dependencies)
    || !pkg?.packages
  )
    return
  for (const [name, version] of entries(dependencies)) {
    if (!pkgSet.has(name) && !rootPkgSet.has(name)) {
      shouldOptimize && pkgSet.add(name)
      pkg.packages[name] = { version, type, packages: {} }
    }
    else {
      pkg.packages[name] = {}
    }
  }
}

function loadPkgs(
  rootPkgs: IPkgs | undefined,
  maxDep: number,
  rememberLayer: number,
) {
  if (rootPkgs === undefined)
    return
  if (maxDep === 0) {
    for (const key of Object.keys(rootPkgs))
      delete rootPkgs[key].packages
    return
  }
  for (const key of Object.keys(rootPkgs)) {
    try {
      if (!key.startsWith('.')) {
        pkgSet.add(key)
        const { dependencies, devDependencies } = relations[key] ?? {}
        addPkg(rootPkgs[key], dependencies, EDep.DEPENDENCY, maxDep > 2)
        addPkg(rootPkgs[key], devDependencies, EDep.DEVDEPENDENCY, maxDep > 2)
        if (isEmptyObj(rootPkgs[key].packages))
          delete rootPkgs[key].packages
        loadPkgs(rootPkgs[key].packages, maxDep - 1, rememberLayer - 1 ? rememberLayer - 1 : 0)
        maxDep < 3 && pkgSet.delete(key)
      }
    }
    catch (err: any) {
      LogNotExportPkg(err.message)
    }
  }
}

export async function outputFile(
  depth: number,
  p: string = './',
  isJSON = false,
) {
  const pkgs: IPkgs = {}
  const { devDependencies, dependencies } = rootPkg.__root__
  for (const [name, version] of entries(devDependencies) as any)
    pkgs[name] = { version, type: EDep.DEVDEPENDENCY, packages: {} }
  for (const [name, version] of entries(dependencies) as any)
    pkgs[name] = { version, type: EDep.DEPENDENCY, packages: {} }
  const begin = Date.now()
  isJSON && logLogo()
  try {
    loadPkgs(pkgs, depth, depth > 5 ? 2 : depth - 1)
    await fs.writeFile(path.resolve(p, './pkgs.json'), JSON.stringify(pkgs))
  }
  catch (err: any) {
    logFileWirteError(err.message)
  }
  finally {
    const end = Date.now()
    logFileWirteFinished(end - begin, p)
  }
}
