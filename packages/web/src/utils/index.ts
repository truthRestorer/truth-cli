import type { ECharts } from 'echarts/core'
import type { Links, Nodes, Relations, Tree, Versions } from '@truth-cli/shared'
import { isEmptyObj } from '@truth-cli/shared'
import { genCirculation, genGraph, genTree, genVersions } from '@truth-cli/core'
import type { Legend, PkgInfo } from '../types'
import { loadGraph, loadTree } from './tools'

let echart: ECharts
const treeNodeMap = new Map()
const nodesSet = new Set()
let relations: Relations
let graphNodes: Nodes[]
let graphLinks: Links[]
let tree: Tree
let versions: Versions
let circulation: { [key: string]: string[] }

export function initChart(_echart: ECharts, _relations: Relations) {
  const { nodes, links } = genGraph(_relations.__root__)
  _echart.setOption(loadGraph(graphNodes = nodes, graphLinks = links))
  relations = _relations
  echart = _echart
  tree = genTree(1, relations)
  versions = genVersions(relations)
  circulation = genCirculation(relations)
}

export function changeGraphRoot(name: string, isAim: boolean) {
  if (!relations[name])
    return
  if (isAim) {
    resetChart({ nodes: graphNodes, links: graphLinks })
    return
  }
  const newNodes = [{ name, category: 2, value: relations[name].version! }]
  const { nodes, links } = genGraph(relations[name])
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i].name !== name)
      newNodes.push(nodes[i])
  }
  resetChart({ nodes: newNodes, links })
}

export function collapseNode(legend: Legend) {
  if (legend === 'Graph') {
    const { nodes, links } = genGraph(relations.__root__)
    resetChart({ nodes: graphNodes = nodes, links: graphLinks = links })
    nodesSet.clear()
    return
  }
  for (const map of treeNodeMap.values())
    map.collapsed = true
  resetChart({ tree })
  treeNodeMap.clear()
}

export function dealGraphNode(name: string) {
  if (name === '__root__' || !relations[name])
    return
  const { nodes, links } = genGraph(relations[name], name, 0)
  if (!nodes.length)
    return
  if (nodesSet.has(name)) {
    nodesSet.delete(name)
    const nodeHad = new Set(nodes.map(node => node.name))
    const { dependencies = {}, devDependencies } = relations.__root__
    // 引用次数，默认将根项目设置为 1
    const linksMap = new Map(Object.keys(Object.assign(dependencies, devDependencies)).map(key => [key, 1]))
    for (let i = 0; i < graphLinks.length; i++) {
      const { source } = graphLinks[i]
      const linkNum = linksMap.get(graphLinks[i].source)
      if (linkNum !== undefined)
        linksMap.set(source, linkNum + 1)
      else
        linksMap.set(source, 0)
    }
    graphNodes = graphNodes.filter(({ name }) => !nodeHad.has(name) || linksMap.get(name))
  }
  else {
    nodesSet.add(name)
    const nodeHad = new Set(graphNodes.map(node => node.name))
    const linkHad: any = {}
    for (let i = 0; i < graphLinks.length; i++) {
      const { source, target } = graphLinks[i]
      if (!linkHad[source])
        linkHad[source] = [target]
      else
        linkHad[source].push(target)
    }
    for (let i = 0; i < links.length; i++) {
      const { source, target } = links[i]
      if (!linkHad[source]?.includes(target))
        graphLinks.push(links[i])
    }
    for (let i = 0; i < nodes.length; i++) {
      if (!nodeHad.has(nodes[i].name))
        graphNodes.push(nodes[i])
    }
  }
  resetChart({ nodes: graphNodes, links: graphLinks })
}

export function dealTreeNode(data: any, collapsed: boolean, ancestors?: any) {
  if (collapsed) {
    const node = treeNodeMap.get(data.name)
    node && (node.collapsed = true)
    treeNodeMap.delete(data.name)
    return
  }
  const { dependencies = {}, devDependencies } = relations[formatName(data.name)] ?? {}
  const pkg = Object.assign(dependencies, devDependencies)
  if (isEmptyObj(pkg) || data.children.length)
    return
  let child = tree.children
  for (let i = 2; i < ancestors.length; i++) {
    const item = child.find(item => item.name === ancestors[i].name)!
    item.collapsed = false
    treeNodeMap.set(item.name, item)
    child = item.children
  }
  for (const [name, value] of Object.entries(pkg)) {
    child.push({
      // echarts 对相同名字的标签会动画重叠，这里用 -- 区分一下
      name: `${name}--${data.name}`,
      value,
      children: [],
    })
  }
  resetChart({ tree })
}

export function toggleChart(legend: Legend) {
  const isGraph = legend === 'Graph'
  echart.setOption(isGraph ? loadTree(tree) : loadGraph(graphNodes, graphLinks))
  return isGraph ? 'Tree' : 'Graph'
}

export function getPkgInfo(name: string): PkgInfo {
  return {
    info: relations[name] ?? Object.values(relations).find(val => val.name?.includes(name)),
    circulation: circulation[name],
    versions: versions[name],
  }
}

function resetChart(data: {
  tree?: Tree
  nodes?: Nodes[]
  links?: Links[]
}) {
  echart.setOption({
    series: data.tree
      ? { name: 'Tree', data: [data.tree] }
      : { name: 'Force', ...data },
  })
}

export function formatName(name: string) {
  return name.split('--')[0]
}
