/* eslint-disable no-console */
import fs from 'node:fs'
import path from 'node:path'
import { getPackageInfo } from 'local-pkg'

enum Dep {
  'DEVDEPENDENCY',
  'DEPENDENCY',
}
interface IPkgs {
  [key: string]: any
}

const pkgs: IPkgs = {}

function init() {
  const json = fs.readFileSync(path.resolve('./package.json'))
  const { devDependencies, dependencies } = JSON.parse(json.toString())
  for (const [name, version] of Object.entries(devDependencies ?? {}) as any)
    pkgs[name] = { version, type: Dep.DEVDEPENDENCY, packages: {} }
  for (const [name, version] of Object.entries(dependencies ?? {}) as any)
    pkgs[name] = { version, type: Dep.DEPENDENCY, packages: {} }
}

/**
 * 递归生成依赖关系，默认最大递归深度为  7
 * @param rootPkgs 依赖项
 * @param maxDep 最大递归深度
 * @returns
 */
async function loadPkgs(rootPkgs: IPkgs, maxDep: number = 5) {
  if (maxDep === 0)
    return
  for (const key of Object.keys(rootPkgs)) {
    const pkgsInfo = await getPackageInfo(key)
    for (const [name, version] of Object.entries(pkgsInfo?.packageJson.devDependencies ?? {}) as any)
      rootPkgs[key].packages[name] = { version, type: Dep.DEVDEPENDENCY, packages: {} }
    for (const [name, version] of Object.entries(pkgsInfo?.packageJson.dependencies ?? {}) as any)
      rootPkgs[key].packages[name] = { version, type: Dep.DEPENDENCY, packages: {} }
    if (JSON.stringify(rootPkgs[key].packages) !== '{}')
      await loadPkgs(rootPkgs[key].packages, maxDep - 1)
  }
}

init()

export function analyze(depth: number, p: string = './') {
  loadPkgs(pkgs, depth).then(() => {
    fs.writeFile(path.resolve(p, './pkgs.json'), JSON.stringify(pkgs), (err) => {
      if (err)
        throw new Error('出错了')
      console.log('done')
    })
  })
}
