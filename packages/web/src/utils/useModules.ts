/* eslint-disable no-console */
import type { ILinks, INodes } from '../types'

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

function initAllModules() {
  const root = import.meta.glob('./package.json', { eager: true })
  const { name, devDependencies, dependencies } = Object.values(root)[0] as any
  addNode(name)
  dealPkgs(name, dependencies, 0)
  dealPkgs(name, devDependencies, 1)

  const modules = import.meta.glob('./node_modules/**/package.json', { eager: true })
  for (const { name, devDependencies, dependencies } of Object.values(modules) as any) {
    addNode(name, 2)
    dealPkgs(name, dependencies, 0)
    dealPkgs(name, devDependencies, 1)
  }
}

function initDevModules() {
  const root = import.meta.glob('./package.json', { eager: true })
  const { name, devDependencies } = Object.values(root)[0] as any
  addNode(name)
  dealPkgs(name, devDependencies, 1)
  const modules = import.meta.glob('./node_modules/**/package.json', { eager: true })
  for (const { name, devDependencies } of Object.values(modules) as any) {
    addNode(name, 2)
    dealPkgs(name, devDependencies, 1)
  }
}

function initModules() {
  const root = import.meta.glob('./package.json', { eager: true })
  const { name, dependencies } = Object.values(root)[0] as any
  addNode(name)
  dealPkgs(name, dependencies, 0)

  const modules = import.meta.glob('./node_modules/**/package.json', { eager: true })
  for (const { name, dependencies } of Object.values(modules) as any) {
    addNode(name, 2)
    dealPkgs(name, dependencies, 0)
  }
}

export function useModules(type: 'all' | 'dev' | 'default') {
  switch (type) {
    case 'all':
      initAllModules()
      break
    case 'dev':
      initDevModules()
      break
    default:
      initModules()
  }
  console.log({ nodes, links })
  return {
    nodes,
    links,
  }
}
