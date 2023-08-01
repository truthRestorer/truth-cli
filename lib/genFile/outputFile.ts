import fs from 'node:fs/promises'
import path from 'node:path'
import { getPackageInfo } from 'local-pkg'
import { EDep } from 'lib/utils/types.js'
import type { IPkgs } from 'lib/utils/types.js'
import { LogNotExportPkg, logFileWirteError, logFileWirteFinished, logLogo } from '../utils/const.js'
import { readFile } from '../utils/tools.js'

const pkgs: IPkgs = {}

async function initRootModules() {
  try {
    const { devDependencies, dependencies } = await readFile(path.resolve('./package.json'))
    for (const [name, version] of Object.entries(devDependencies ?? {}) as any)
      pkgs[name] = { version, type: EDep.DEVDEPENDENCY, packages: {} }
    for (const [name, version] of Object.entries(dependencies ?? {}) as any)
      pkgs[name] = { version, type: EDep.DEPENDENCY, packages: {} }
  }
  catch (err: any) {
    LogNotExportPkg(err.message)
  }
}

function addPkg(pkg: IPkgs, devDependencies: IPkgs | undefined, dependencies: IPkgs | undefined) {
  for (const [name, version] of Object.entries(devDependencies ?? {}))
    pkg.packages[name] = { version, type: EDep.DEVDEPENDENCY, packages: {} }
  for (const [name, version] of Object.entries(dependencies ?? {}))
    pkg.packages[name] = { version, type: EDep.DEPENDENCY, packages: {} }
}

// FIXME: 循环引用问题
async function loadPkgsByRead(rootPkgs: IPkgs, maxDep: number) {
  if (maxDep === 0)
    return
  for (const key of Object.keys(rootPkgs)) {
    try {
      if (!key.startsWith('.')) {
        const { packageJson } = await getPackageInfo(key) ?? {}
        addPkg(rootPkgs[key], packageJson?.dependencies, packageJson?.devDependencies)
        if (JSON.stringify(rootPkgs[key].packages) !== '{}')
          await loadPkgsByRead(rootPkgs[key].packages, maxDep - 1)
      }
    }
    catch (err: any) {
      LogNotExportPkg(err.message)
    }
  }
}

export async function outputFile(depth: number, p: string = './', isLogLogo = false) {
  const begin = Date.now()
  isLogLogo && logLogo()
  await initRootModules()
  try {
    await loadPkgsByRead(pkgs, depth)
  }
  catch (err: any) {
    logFileWirteError(err.message)
  }
  finally {
    const end = Date.now()
    await fs.writeFile(path.resolve(p, './pkgs.json'), JSON.stringify(pkgs))
    logFileWirteFinished(end - begin, p)
  }
}
