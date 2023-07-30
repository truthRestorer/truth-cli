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
  DEPENDENCY,
  ROOT,
}
function addNode(name: string, version: string, category: number) {
  if (!nodesMap.has(name)) {
    nodes.push({
      name,
      category,
      value: version,
      symbolSize: (category + 0.5) * (category + 30),
    })
    nodesMap.set(name, category)
  }
}

async function readGlob(p: string) {
  if (!p.includes('node_modules')) {
    const pkg = await readFile(p)
    relations[pkg.name] = pkg
    addNode(pkg.name, pkg.version, EDeps.ROOT)
    return
  }
  const pkgsRoot = await readDir(p)
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
          relations[pkg.name] = pkg
        }
      }
      catch (err: any) {
        LogNotExportPkg(err.message)
      }
    }
  }
}

export default async function initModules() {
  await readGlob('./package.json')
  await readGlob('./node_modules/')
  for (const [key, { dependencies, devDependencies, version }] of Object.entries(relations)) {
    for (const [pkgName, pkgVersion] of Object.entries(dependencies ?? {}))
      addNode(pkgName, pkgVersion as string, EDeps.DEPENDENCY)
    for (const [pkgName, pkgVersion] of Object.entries(devDependencies ?? {}))
      addNode(pkgName, pkgVersion as string, EDeps.DEPENDENCY)
    const pkg = Object.assign({}, dependencies, devDependencies)
    addNode(key, version, EDeps.DEPENDENCY)
    for (const target of Object.keys(pkg)) {
      links.push({
        source: key,
        target,
      })
    }
  }
  return {
    nodes,
    links,
    relations,
  }
}
