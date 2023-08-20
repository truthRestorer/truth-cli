import type { ECharts } from 'echarts/core'
import type { Links, Nodes, Relations, Tree } from '@truth-cli/shared'
import { isEmptyObj, useAssign, useEntries } from '@truth-cli/shared'
import { genGraph, genTree } from '@truth-cli/core'
import { preDealName } from '../preDealName'
import type { Legend } from '../../types'
import { loadGraphOptions, loadTreeOptions, resetOptions } from './options'

let echart: ECharts

export function initChart(chart: ECharts, relations: Relations) {
  const { nodes, links } = genGraph(relations.__root__)
  echart = chart
  const options = {
    tooltip: {},
    animationThreshold: 16777216,
    hoverLayerThreshold: 16777216,
    textStyle: {
      fontSize: 13,
    },
    ...loadGraphOptions(nodes, links),
  }
  echart.setOption(options)
}

export class TreeChart {
  tree: Tree
  private treeNodeMap = new Map()
  constructor(public relations: Relations) {
    this.tree = genTree(1, relations)
  }

  renderChart(): Legend {
    echart?.setOption(loadTreeOptions(this.tree))
    return 'Tree'
  }

  addTreeNode(ancestors: any, data: any) {
    // echarts 对相同名字的标签会动画重叠，这里用 -- 区分一下
    const name = preDealName(data.name)
    const { dependencies, devDependencies } = this.relations[name] ?? {}
    const pkg = useAssign(dependencies, devDependencies)
    if (
      data.children.length
      || isEmptyObj(pkg)
    )
      return
    let child = this.tree.children
    for (let i = 2; i < ancestors.length; i++) {
      const item = child.find((item: any) => item.name === ancestors[i].name)!
      this.treeNodeMap.set(item.name, item)
      child = item.children
    }
    for (const map of this.treeNodeMap.values())
      map.collapsed = false
    for (const [pkgName, pkgVersion] of useEntries(pkg)) {
      child.push({
        name: `${pkgName}--${data.name}`,
        value: pkgVersion,
        children: [],
      })
    }
    echart?.setOption(resetOptions('Tree', { tree: this.tree }))
  }

  removeTreeNode(data: any) {
    const node = this.treeNodeMap.get(data.name)
    node && (node.collapsed = true)
    this.treeNodeMap.delete(data.name)
  }

  collapseAllTreeNode() {
    for (const map of this.treeNodeMap.values())
      map.collapsed = true
    this.treeNodeMap.clear()
    echart?.setOption(resetOptions('Tree', { tree: this.tree }))
  }
}

export class GraphChart {
  nodes: Nodes[]
  links: Links[]
  nodesSet = new Set()
  constructor(public relations: Relations) {
    const { nodes, links } = genGraph(relations.__root__)
    this.nodes = nodes
    this.links = links
  }

  renderChart(): Legend {
    echart?.setOption(loadGraphOptions(this.nodes, this.links))
    return 'Graph'
  }

  collapseGraphNode() {
    const { nodes, links } = genGraph(this.relations.__root__)
    this.nodes = nodes
    this.links = links
    echart?.setOption(resetOptions('Graph', {
      nodes: this.nodes,
      links: this.links,
    }))
  }

  addGraph(name: string) {
    if (name === '__root__' || !this.relations[name])
      return
    const { nodes, links } = genGraph(this.relations[name], name)
    this.links.push(...links)
    const nodesSet = new Set(this.nodes.map((item: Nodes) => item.name))
    for (let i = 0; i < nodes.length; i++) {
      if (!nodesSet.has(nodes[i].name))
        this.nodes.push(nodes[i])
      nodesSet.add(nodes[i].name)
    }
    echart?.setOption(resetOptions('Graph', {
      nodes: this.nodes,
      links: this.links,
    }))
  }
}
