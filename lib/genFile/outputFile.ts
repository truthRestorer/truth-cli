import fs from 'node:fs/promises'
import path from 'node:path'
import { getPackageInfo } from 'local-pkg'
import { LogNotExportPkg, logFileWirteError } from '../utils/const.js'
import { readFile } from '../utils/tools.js'

enum Dep {
  'DEVDEPENDENCY',
  'DEPENDENCY',
}
interface IPkgs {
  [key: string]: any
}

const pkgs: IPkgs = {}

async function initRootModules() {
  try {
    const { devDependencies, dependencies } = await readFile(path.resolve('./package.json'))
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
async function loadPkgsByRead(rootPkgs: IPkgs, maxDep: number) {
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
          await loadPkgsByRead(rootPkgs[key].packages, maxDep - 1)
      }
    }
    catch (err: any) {
      LogNotExportPkg(err.message)
    }
  }
}

function loadPkgsByRelations(rootPkgs: IPkgs, maxDep: number, relations: any) {
  if (maxDep === 0)
    return
  for (const key of Object.keys(rootPkgs)) {
    // FIXME: 有个弱智的包，别人引用它叫 eslint-plugin-import, 自己的包名叫 eslint-plugin-i, 所以加个判断
    if (relations[key]) {
      const { devDependencies, dependencies } = relations[key]
      for (const [name, version] of Object.entries(devDependencies ?? {}) as any)
        rootPkgs[key].packages[name] = { version, type: Dep.DEVDEPENDENCY, packages: {} }
      for (const [name, version] of Object.entries(dependencies ?? {}) as any)
        rootPkgs[key].packages[name] = { version, type: Dep.DEPENDENCY, packages: {} }
      if (JSON.stringify(rootPkgs[key].packages) !== '{}')
        loadPkgsByRelations(rootPkgs[key].packages, maxDep - 1, relations)
    }
  }
}

export async function outputFile(depth: number, p: string = './', isJSON: boolean = true) {
  await initRootModules()
  if (isJSON) {
    try {
      await loadPkgsByRead(pkgs, depth)
      await fs.writeFile(path.resolve(p, './pkgs.json'), JSON.stringify(pkgs))
    }
    catch (err: any) {
      logFileWirteError(err.message)
    }
  }
  else {
    import('./relations.js').then(({ relations }) => {
      // console.log(relations)
      loadPkgsByRelations(pkgs, depth, relations)
    })
  }
}
