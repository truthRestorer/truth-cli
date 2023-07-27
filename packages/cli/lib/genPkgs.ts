/* eslint-disable no-console */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { ILinks, INodes } from '../types'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

const nodesName = new Set()
const nodes: INodes[] = []
const links: ILinks[] = []

function addNode(name: string, category: number = 3) {
  if (!name)
    return
  if (!nodesName.has(name)) {
    nodes.push({
      name,
      id: name,
      category,
    })
    nodesName.add(name)
  }
}

function dealPkgs(name: string, pkgs: any, category: number) {
  if (!pkgs)
    return
  for (const key of Object.keys(pkgs)) {
    addNode(key, category)
    links.push({
      source: key,
      target: name,
    })
  }
}

function readGlob(p: string) {
  if (!p.includes('node_modules')) {
    const json = fs.readFileSync(p)
    const pkg = JSON.parse(json.toString())
    return pkg
  }
  const pkgsRoot = fs.readdirSync(p)
  const pkgs: {
    [key: string]: any
  } = {}
  for (let i = 0; i < pkgsRoot.length; i++) {
    try {
      const t = path.resolve(p, `${pkgsRoot[i]}/package.json`)
      const json = fs.readFileSync(t)
      const pkg = JSON.parse(json.toString())
      pkgs[pkg.name] = {
        devDependencies: pkg.devDependencies,
        dependencies: pkg.dependencies,
        name: pkg.name,
      }
    }
    catch (err) {
      console.log(err)
    }
  }
  return pkgs
}

function initModules() {
  const root = readGlob('./package.json')
  const { name, devDependencies, dependencies } = root as any
  addNode(name)
  dealPkgs(name, dependencies, 0)
  dealPkgs(name, devDependencies, 1)

  const modules = readGlob('./node_modules/') as any
  for (const { name, devDependencies, dependencies } of Object.values(modules) as any) {
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
