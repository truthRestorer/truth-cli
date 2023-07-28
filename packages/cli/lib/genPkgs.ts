/* eslint-disable no-console */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { ILinks, INodes } from '../types'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const nodesName = new Set()
const nodes: INodes[] = []
const links: ILinks[] = []

function addNode(name: string, category: number = 3, version: string = 'latest') {
  if (!name)
    return
  if (!nodesName.has(name)) {
    nodes.push({
      name,
      id: name,
      category,
      version,
    })
    nodesName.add(name)
  }
}

function dealPkgs(name: string, pkgs: any, category: number) {
  if (!pkgs)
    return
  for (const [key, version] of Object.entries(pkgs)) {
    addNode(key, category, version as string)
    links.push({
      source: key,
      target: name,
    })
  }
}

function readDir(p: string) {
  const pkgsRoot = fs.readdirSync(p)
  return pkgsRoot
}

function readFile(p: string) {
  const json = fs.readFileSync(p)
  const pkg = JSON.parse(json.toString())
  return pkg
}

function readGlob(p: string) {
  if (!p.includes('node_modules')) {
    const json = fs.readFileSync(p)
    const pkg = JSON.parse(json.toString())
    return pkg
  }

  const pkgsRoot = readDir(p)
  const pkgs: {
    [key: string]: any
  } = {}
  for (let i = 0; i < pkgsRoot.length; i++) {
    const pkgPath = path.resolve(p, `${pkgsRoot[i]}`)
    if (!pkgsRoot[i].includes('.')) {
      // 处理带有 @
      if (pkgsRoot[i].startsWith('@')) {
        const dirs = readDir(pkgPath)
        for (let i = 0; i < dirs.length; i++)
          readGlob(pkgPath)
      }
      else {
        const pkg = readFile(`${pkgPath}/package.json`)
        pkgs[pkg.name] = {
          devDependencies: pkg.devDependencies,
          dependencies: pkg.dependencies,
        }
      }
    }
  }
  return pkgs
}

function initModules() {
  const root = readGlob('./package.json')
  const { name, devDependencies, dependencies } = (root ?? {}) as any
  addNode(name)
  dealPkgs(name, dependencies, 0)
  dealPkgs(name, devDependencies, 1)

  const modules = readGlob('./node_modules/') as any
  for (const [name, { devDependencies, dependencies }] of Object.entries(modules ?? {}) as any) {
    addNode(name, 2)
    dealPkgs(name, dependencies, 0)
    dealPkgs(name, devDependencies, 1)
  }
}

export default function useModules() {
  initModules()

  fs.writeFile(`${path.resolve(__dirname, '../../web/src/assets')}/charts.json`, JSON.stringify({ nodes, links }), (err) => {
    if (err)
      console.log(err.message)
    console.log('done')
  })
}
