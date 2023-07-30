// 生成 echarts 中 graph 所需要的数据
import path from 'node:path'
import type { ILinks, INodes } from '../src/types'
import { LogNotExportPkg } from '../src/const'
import { readDir, readFile } from '../src/tools'

const nodesMap = new Map()
const nodes: INodes[] = []
const links: ILinks[] = []
const relations: { [key: string]: any } = {}
enum EDeps {
  DEVDEPENDENCY,
  DEPENDENCY,
  ROOT,
}

function addNode(name: string, category: number, version: string = 'latest') {
  if (!name)
    return
  if (!nodesMap.has(name)) {
    nodes.push({
      name,
      category,
      value: version,
      symbolSize: (category + 3) ** 2,
    })
    nodesMap.set(name, { version, category })
  }
}

function dealPkgs(name: string, pkgs: any, category: number) {
  if (!pkgs)
    return
  for (const [key, version] of Object.entries(pkgs)) {
    addNode(key, category, version as string)
    links.push({
      source: name,
      target: key,
    })
  }
}

async function readGlob(p: string) {
  if (!p.includes('node_modules')) {
    const pkg = await readFile(p)
    relations[pkg.name] = {
      dependencies: pkg.dependencies,
      devDependencies: pkg.devDependencies,
    }
    return pkg
  }
  const pkgsRoot = await readDir(p)
  const pkgs: {
    [key: string]: any
  } = {}
  for (let i = 0; i < pkgsRoot.length; i++) {
    const pkgPath = path.resolve(p, `${pkgsRoot[i]}`)
    if (!pkgsRoot[i].includes('.')) {
      try {
        // 处理带有 @
        if (pkgsRoot[i].startsWith('@')) {
          const dirs = await readDir(pkgPath)
          for (let i = 0; i < dirs.length; i++)
            await readGlob(pkgPath)
        }
        else {
          const pkg = await readFile(`${pkgPath}/package.json`)
          pkgs[pkg.name] = {
            devDependencies: pkg.devDependencies,
            dependencies: pkg.dependencies,
            version: pkg.version,
          }
          relations[pkg.name] = {
            dependencies: pkg.dependencies,
            devDependencies: pkg.devDependencies,
            version: pkg.version,
          }
        }
      }
      catch (err: any) {
        LogNotExportPkg(err.message)
      }
    }
  }
  return pkgs
}

async function initModules() {
  const root = await readGlob('./package.json') ?? {}
  const { name, devDependencies, dependencies, version } = root as any
  addNode(name, EDeps.ROOT, version)
  dealPkgs(name, dependencies, EDeps.DEPENDENCY)
  dealPkgs(name, devDependencies, EDeps.DEVDEPENDENCY)

  const modules = await readGlob('./node_modules/') ?? {}
  for (const [name, { devDependencies, dependencies }] of Object.entries(modules) as any) {
    dealPkgs(name, dependencies, EDeps.DEPENDENCY)
    dealPkgs(name, devDependencies, EDeps.DEVDEPENDENCY)
  }
  for (const name of Object.keys(modules) as any) {
    if (name) {
      const node = nodesMap.get(name)
      node && addNode(name, node.category, node.version)
    }
  }
}

export default async function genGraphPkgs() {
  await initModules()
  return {
    nodes,
    links,
    relations,
  }
}
