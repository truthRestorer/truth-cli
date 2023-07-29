import fs from 'node:fs/promises'
import path from 'node:path'
import { getPackageInfo } from 'local-pkg'
import { LogNotExportPkg, logFileWirteError } from './src/const'
import { readFile } from './src/tools'

enum Dep {
  'DEVDEPENDENCY',
  'DEPENDENCY',
}
interface IPkgs {
  [key: string]: any
}

const pkgs: IPkgs = {}

async function init() {
  try {
    const json = await readFile('package.json')
    const { devDependencies, dependencies } = JSON.parse(json.toString())
    for (const [name, version] of Object.entries(devDependencies ?? {}) as any)
      pkgs[name] = { version, type: Dep.DEVDEPENDENCY, packages: {} }
    for (const [name, version] of Object.entries(dependencies ?? {}) as any)
      pkgs[name] = { version, type: Dep.DEPENDENCY, packages: {} }
  }
  catch (err: any) {
    LogNotExportPkg(err.message)
  }
}
// FIXME: 循环引用问题
async function loadPkgs(rootPkgs: IPkgs, maxDep: number = 5) {
  if (maxDep === 0)
    return
  for (const key of Object.keys(rootPkgs)) {
    try {
      if (!key.startsWith('.')) {
        const pkgsInfo = await getPackageInfo(key)
        for (const [name, version] of Object.entries(pkgsInfo?.packageJson?.devDependencies ?? {}) as any)
          rootPkgs[key].packages[name] = { version, type: Dep.DEVDEPENDENCY, packages: {} }
        for (const [name, version] of Object.entries(pkgsInfo?.packageJson?.dependencies ?? {}) as any)
          rootPkgs[key].packages[name] = { version, type: Dep.DEPENDENCY, packages: {} }
        if (JSON.stringify(rootPkgs[key].packages) !== '{}')
          await loadPkgs(rootPkgs[key].packages, maxDep - 1)
      }
    }
    catch (err: any) {
      LogNotExportPkg(err.message)
    }
  }
}

export async function outputFile(depth: number, p: string = './') {
  init()
  try {
    await loadPkgs(pkgs, depth)
    await fs.writeFile(path.resolve(p, './pkgs.json'), JSON.stringify(pkgs))
  }
  catch (err: any) {
    logFileWirteError(err.message)
  }
}
