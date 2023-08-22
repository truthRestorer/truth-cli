import type { ECharts } from 'echarts/core'
import type { Links, Nodes, Relations, Tree, Versions } from '@truth-cli/shared'
import { isEmptyObj, useAssign, useEntries } from '@truth-cli/shared'
import { genGraph, genTree, genVersions } from '@truth-cli/core'
import { preDealName } from '../preDealName'
import type { Legend } from '../../types'
import { loadGraphOptions, loadTreeOptions, resetOptions } from './options'
import { fuzzySearch, getCirculation } from './tools'

let echart: ECharts
let graphNodeSet: Set<string>
const treeNodeMap = new Map()
let relations: Relations
let nodes: Nodes[]
let links: Links[]
let tree: Tree
let versions: Versions

export function initChart(chart: ECharts, _relations: Relations) {
  const graph = genGraph(_relations.__root__)
  const options = {
    tooltip: {},
    animationThreshold: 16777216,
    hoverLayerThreshold: 16777216,
    ...loadGraphOptions(graph.nodes, graph.links),
  }
  chart.setOption(options)
  nodes = graph.nodes
  links = graph.links
  relations = _relations
  echart = chart
  tree = genTree(1, relations)
  versions = genVersions(relations)
  graphNodeSet = new Set(nodes.map(item => item.name))
}

export function collapseNode(legend: Legend) {
  if (legend === 'Graph') {
    const graph = genGraph(relations.__root__)
    echart?.setOption(resetOptions('Graph', {
      nodes: graph.nodes,
      links: graph.links,
    }))
    nodes = graph.nodes
    links = graph.links
    graphNodeSet = new Set(nodes.map(item => item.name))
  }
  else {
    for (const map of treeNodeMap.values())
      map.collapsed = true
    treeNodeMap.clear()
    echart?.setOption(resetOptions('Tree', { tree }))
  }
}

export function addTreeNode(ancestors: any, data: any) {
  // echarts 对相同名字的标签会动画重叠，这里用 -- 区分一下
  const name = preDealName(data.name)
  const { dependencies, devDependencies } = relations[name] ?? {}
  const pkg = useAssign(dependencies, devDependencies)
  if (
    data.children.length
    || isEmptyObj(pkg)
  )
    return
  let child = tree.children
  for (let i = 2; i < ancestors.length; i++) {
    const item = child.find((item: any) => item.name === ancestors[i].name)!
    treeNodeMap.set(item.name, item)
    child = item.children
  }
  for (const map of treeNodeMap.values())
    map.collapsed = false
  for (const [pkgName, pkgVersion] of useEntries(pkg)) {
    child.push({
      name: `${pkgName}--${data.name}`,
      value: pkgVersion,
      children: [],
    })
  }
  echart?.setOption(resetOptions('Tree', { tree }))
}

export function addGraphNode(name: string) {
  if (name === '__root__' || !relations[name])
    return
  const graph = genGraph(relations[name], name)
  links.push(...graph.links)
  graphNodeSet.add(name)
  for (let i = 0; i < graph.nodes.length; i++) {
    if (!graphNodeSet.has(graph.nodes[i].name))
      nodes.push(graph.nodes[i])
    graphNodeSet.add(graph.nodes[i].name)
  }
  echart?.setOption(resetOptions('Graph', {
    nodes,
    links,
  }))
}

export function removeTreeNode(data: any) {
  const node = treeNodeMap.get(data.name)
  node && (node.collapsed = true)
  treeNodeMap.delete(data.name)
}

export function toggleChart(legend: Legend) {
  if (legend === 'Graph') {
    echart?.setOption(loadTreeOptions(tree))
    return 'Tree'
  }
  echart.setOption(loadGraphOptions(nodes, links))
  return 'Graph'
}

export function getPkgInfo(name: string) {
  const { relatedPkg, relatedName } = fuzzySearch(name, relations)
  return {
    info: relatedName ? { name: relatedName, ...relatedPkg } : undefined,
    circulation: getCirculation?.(name, relations),
    versions: versions?.[name],
  }
}
