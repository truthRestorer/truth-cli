import type { ECharts } from 'echarts/core'
import type { Links, Nodes, Relations, Tree, Versions } from '@truth-cli/shared'
import { isEmptyObj } from '@truth-cli/shared'
import { genGraph, genTree, genVersions } from '@truth-cli/core'
import type { Legend, PkgInfo } from '../types'
import { formatName } from './formatName'
import { loadGraph, loadTree } from './tools'

let echart: ECharts
const treeNodeMap = new Map()
const nodesSet = new Set()
let relations: Relations
let graphNodes: Nodes[]
let graphLinks: Links[]
let tree: Tree
let versions: Versions

export function initChart(_echart: ECharts, _relations: Relations) {
  const { nodes, links } = genGraph(_relations.__root__)
  const options = {
    toolbox: {
      feature: { saveAsImage: {} },
    },
    tooltip: {},
    animationThreshold: 16777216,
    hoverLayerThreshold: 16777216,
    ...loadGraph(graphNodes = nodes, graphLinks = links),
  }
  _echart.setOption(options)
  relations = _relations
  echart = _echart
  tree = genTree(1, relations)
  versions = genVersions(relations)
}

export function changeGraphRoot(name: string, isAim: boolean) {
  if (!relations[name])
    return
  if (isAim) {
    resetChart({ nodes: graphNodes, links: graphLinks })
    return
  }
  const { version } = relations[name]
  const newNodes = [{ name, category: 2, value: version as string }]
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

export function dealGraphNode(nodeName: string) {
  if (nodeName === '__root__' || !relations[nodeName])
    return
  const { nodes, links } = genGraph(relations[nodeName], nodeName, 0)
  if (!nodes.length)
    return
  if (nodesSet.has(nodeName)) {
    nodesSet.delete(nodeName)
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
    nodesSet.add(nodeName)
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
    treeNodeMap.set(item.name, item)
    child = item.children
  }
  for (const map of treeNodeMap.values())
    map.collapsed = false
  for (const [pkgName, pkgVersion] of Object.entries(pkg)) {
    child.push({
    // echarts 对相同名字的标签会动画重叠，这里用 -- 区分一下
      name: `${pkgName}--${data.name}`,
      value: pkgVersion as string,
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
  const { relatedPkg, relatedName } = fuzzySearch(name)
  return {
    info: relatedName ? { name: relatedName, ...relatedPkg } : undefined,
    circulation: getCirculation?.(name),
    versions: versions?.[name],
  }
}

function resetChart(data: {
  tree?: Tree
  nodes?: Nodes[]
  links?: Links[]
}) {
  echart.setOption({
    series: data.tree
      ? {
          name: 'Tree',
          data: [data.tree],
        }
      : {
          name: 'Force',
          nodes: data.nodes,
          links: data.links,
        },
  })
}

function getCirculation(name: string) {
  if (!relations[name])
    return
  const { devDependencies, dependencies = {} } = relations[name]
  const pkgs = Object.assign(dependencies, devDependencies)
  const result = []
  for (const pkg of Object.keys(pkgs)) {
    if (relations[pkg]) {
      const { devDependencies = {}, dependencies } = relations[pkg]
      const relationPkg = Object.assign(devDependencies, dependencies)
      if (Object.keys(relationPkg).includes(name))
        result.push(pkg)
    }
  }
  return result.length ? result : undefined
}

function fuzzySearch(name: string) {
  const relatedPkg = relations[name]
  if (relatedPkg) {
    return {
      relatedPkg,
      relatedName: name,
    }
  }
  const findPkgKey = Object.keys(relations).find((key) => {
    return key.toLowerCase().includes(name.toLowerCase())
  })
  if (!findPkgKey)
    return {}
  return {
    relatedPkg: relations[findPkgKey],
    relatedName: findPkgKey,
  }
}
