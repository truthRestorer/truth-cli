import type { ECharts } from 'echarts/core'
import type { Links, Nodes, Relations, Tree, Versions } from '@truth-cli/shared'
import { isEmptyObj, useAssign, useEntries } from '@truth-cli/shared'
import { genGraph, genTree, genVersions } from '@truth-cli/core'
import { preDealName } from '../preDealName'
import type { Legend, PkgInfo } from '../../types'
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
  relations = _relations
  echart = chart
  const graph = genGraph(relations.__root__)
  nodes = graph.nodes
  links = graph.links
  tree = genTree(1, relations)
  versions = genVersions(relations)
  graphNodeSet = new Set(nodes.map(item => item.name))
  const options = {
    tooltip: {},
    animationThreshold: 16777216,
    hoverLayerThreshold: 16777216,
    ...loadGraphOptions(nodes, links),
  }
  echart.setOption(options)
}

export function collapseNode(legend: Legend) {
  if (legend === 'Graph') {
    const { nodes: _nodes, links: _links } = genGraph(relations.__root__)
    nodes = _nodes
    links = _links
    graphNodeSet = new Set(_nodes.map(item => item.name))
    echart?.setOption(resetOptions('Graph', {
      nodes: _nodes,
      links: _links,
    }))
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
  const { nodes: _nodes, links: _links } = genGraph(relations[name], name)
  links.push(..._links)
  graphNodeSet.add(name)
  for (let i = 0; i < _nodes.length; i++) {
    if (!graphNodeSet.has(_nodes[i].name))
      nodes.push(_nodes[i])
    graphNodeSet.add(_nodes[i].name)
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

export function getPkgInfo(name: string): PkgInfo {
  const { relatedPkg, relatedName } = fuzzySearch(name, relations)
  return {
    __info__: relatedName ? { name: relatedName, ...relatedPkg } : undefined,
    __circulation__: getCirculation?.(name, relations),
    __versions__: versions?.[name],
  }
}
