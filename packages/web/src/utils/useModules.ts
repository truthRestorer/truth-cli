/* eslint-disable no-console */
import type { ILinks, INodes } from '../types'

const nodesName = new Set()
const nodes: INodes[] = []
const links: ILinks[] = []
/**
 * 向 nodes 中添加数据
 * @param name 依赖名称
 * @param category 依赖属于那种，默认 yourself 即自己项目名
 */
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
/**
 * 分析一个依赖的 package.json，并将这个依赖与其 dependencies 和 devDependencies 关联起来
 * @param name 依赖名称
 * @param pkgs 包的数据集
 * @param category 包的类型
 * @returns
 */
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
/**
 * 初始化所有依赖
 */
function initAllModules() {
  const root = import.meta.glob('../../package.json', { eager: true })
  const { name, devDependencies, dependencies } = Object.values(root)[0] as any
  addNode(name)
  dealPkgs(name, dependencies, 0)
  dealPkgs(name, devDependencies, 1)

  const modules = import.meta.glob('../../node_modules/**/package.json', { eager: true })
  for (const { name, devDependencies, dependencies } of Object.values(modules) as any) {
    addNode(name, 2)
    dealPkgs(name, dependencies, 0)
    dealPkgs(name, devDependencies, 1)
  }
}

/**
 * 初始化 devDependencies
 */
function initDevModules() {
  const root = import.meta.glob('../../package.json', { eager: true })
  const { name, devDependencies } = Object.values(root)[0] as any
  addNode(name)
  dealPkgs(name, devDependencies, 1)
  const modules = import.meta.glob('../../node_modules/**/package.json', { eager: true })
  for (const { name, devDependencies } of Object.values(modules) as any) {
    addNode(name, 2)
    dealPkgs(name, devDependencies, 1)
  }
}
/**
 * 初始化 dependencies
 */
function initModules() {
  const root = import.meta.glob('../../package.json', { eager: true })
  const { name, dependencies } = Object.values(root)[0] as any
  addNode(name)
  dealPkgs(name, dependencies, 0)

  const modules = import.meta.glob('../../node_modules/**/package.json', { eager: true })
  for (const { name, dependencies } of Object.values(modules) as any) {
    addNode(name, 2)
    dealPkgs(name, dependencies, 0)
  }
}

/**
 * 导出工具函数
 * @returns { nodes, links }
 */
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
