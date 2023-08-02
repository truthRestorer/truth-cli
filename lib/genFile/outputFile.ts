import fs from 'node:fs/promises'
import path from 'node:path'
import { entries, isEmptyObj } from 'lib/utils/tools.js'
import { EDep } from '../utils/types.js'
import type { IPkgs } from '../utils/types.js'
import { LogNotExportPkg, logFileWirteError, logFileWirteFinished, logLogo } from '../utils/const.js'
import { relations, rootPkg, rootPkgSet } from './relations.js'

const pkgSet = new Set()

function addPkg(pkg: IPkgs, dependencies: IPkgs | undefined, type: EDep) {
  if (!dependencies)
    return
  for (const [name, version] of entries(dependencies)) {
    if (pkg.packages) {
      if (
        rootPkgSet.has(name)
        || pkgSet.has(name)
      )
        pkg.packages[name] = {}
      else
        pkg.packages[name] = { version, type, packages: {} }
    }
  }
}

function loadPkgsByRead(rootPkgs: IPkgs, maxDep: number) {
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
        addPkg(rootPkgs[key], dependencies, EDep.DEPENDENCY)
        addPkg(rootPkgs[key], devDependencies, EDep.DEVDEPENDENCY)
        if (!isEmptyObj(rootPkgs[key].packages)) {
          loadPkgsByRead(rootPkgs[key].packages, maxDep - 1)
          pkgSet.delete(key)
        }
        else {
          delete rootPkgs[key].packages
        }
      }
    }
    catch (err: any) {
      LogNotExportPkg(err.message)
    }
  }
}

export async function outputFile(depth: number, p: string = './', isJSON = false) {
  const pkgs: IPkgs = {}
  const { devDependencies, dependencies } = rootPkg.__root__
  for (const [name, version] of entries(devDependencies) as any)
    pkgs[name] = { version, type: EDep.DEVDEPENDENCY, packages: {} }
  for (const [name, version] of entries(dependencies) as any)
    pkgs[name] = { version, type: EDep.DEPENDENCY, packages: {} }
  const begin = Date.now()
  isJSON && logLogo()
  try {
    loadPkgsByRead(pkgs, depth)
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
