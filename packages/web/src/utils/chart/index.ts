import type { ECharts } from 'echarts/core'
import type { Links, Nodes, Relations, Tree, Versions } from '@truth-cli/shared'
import { isEmptyObj } from '@truth-cli/shared'
import { genGraph, genTree, genVersions } from '@truth-cli/core'
import { preDealName } from '../preDealName'
import type { Legend, PkgInfo } from '../../types'
import { loadGraph, loadTree, setChart } from './options'
import { fuzzySearch, getCirculation, keyOfPkg } from './tools'

let echart: ECharts
const treeNodeMap = new Map()
const nodesSet = new Set()
let relations: Relations
let nodes: Nodes[]
let links: Links[]
let tree: Tree
let versions: Versions

export function initChart(_echart: ECharts, _relations: Relations) {
  const graph = genGraph(_relations.__root__)
  const options = {
    tooltip: {},
    animationThreshold: 16777216,
    hoverLayerThreshold: 16777216,
    ...loadGraph(graph.nodes, graph.links),
  }
  _echart.setOption(options)
  nodes = graph.nodes
  links = graph.links
  relations = _relations
  echart = _echart
  tree = genTree(1, relations)
  versions = genVersions(relations)
}

export function collapseNode(legend: Legend) {
  if (legend === 'Graph') {
    const graph = genGraph(relations.__root__)
    echart?.setOption(setChart('Graph', {
      nodes: graph.nodes,
      links: graph.links,
    }))
    nodes = graph.nodes
    links = graph.links
  }
  else {
    for (const map of treeNodeMap.values())
      map.collapsed = true
    treeNodeMap.clear()
    echart?.setOption(setChart('Tree', { tree }))
  }
}

function addTreeNode(ancestors: any, data: any) {
  const name = preDealName(data.name)
  const { dependencies = {}, devDependencies } = relations[preDealName(name)] ?? {}
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
  echart?.setOption(setChart('Tree', { tree }))
}

function removeGraphNode(name: string) {
  const { dependencies = {}, devDependencies } = relations[name]
  const pkgs = keyOfPkg(dependencies, devDependencies)
  const { dependencies: _d = {}, devDependencies: _dd } = relations.__root__
  const linksMap = new Map(keyOfPkg(_d, _dd).map(key => [key, 1]))
  for (let i = 0; i < links.length; i++) {
    const { source } = links[i]
    linksMap.set(source, linksMap.get(links[i].source) ? 1 : 0)
  }
  nodes = nodes.filter(({ name }) => !pkgs.includes(name) || linksMap.get(name))
}

export function dealGraphNode(name: string) {
  if (name === '__root__' || !relations[name])
    return
  if (nodesSet.has(name)) {
    removeGraphNode(name)
    nodesSet.delete(name)
  }
  else {
    nodesSet.add(name)
    const { nodes: _nodes, links: _links } = genGraph(relations[name], name)
    links.push(..._links)
    const nodesHad = nodes.map(node => node.name)
    for (let i = 0; i < _nodes.length; i++) {
      if (!nodesHad.includes(_nodes[i].name))
        nodes.push(_nodes[i])
    }
  }
  echart?.setOption(setChart('Graph', {
    nodes,
    links,
  }))
}

export function dealTreeNode(data: any, collapsed: boolean, ancestors?: any) {
  if (collapsed) {
    const node = treeNodeMap.get(data.name)
    node && (node.collapsed = true)
    treeNodeMap.delete(data.name)
  }
  else {
    addTreeNode(ancestors!, data)
  }
}

export function toggleChart(legend: Legend) {
  const isGraph = legend === 'Graph'
  echart.setOption(isGraph ? loadTree(tree) : loadGraph(nodes, links))
  return isGraph ? 'Tree' : 'Graph'
}

export function getPkgInfo(name: string): PkgInfo {
  const { relatedPkg, relatedName } = fuzzySearch(name, relations)
  return {
    info: relatedName ? { name: relatedName, ...relatedPkg } : undefined,
    circulation: getCirculation?.(name, relations),
    versions: versions?.[name],
  }
}
