import type { ECharts } from 'echarts/core'
import type { Links, Nodes, Relations, Tree, Versions } from '@truth-cli/shared'
import { isEmptyObj, useAssign, useEntries } from '@truth-cli/shared'
import { genGraph, genTree, genVersions } from '@truth-cli/core'
import type { PkgInfo } from '../types'
import { loadGraphOptions, loadTreeOptions } from './chartOptions'
import { fuzzySearch, getCirculation, graphChartOption, treeChartOption } from './chartMethods'

export class Chart {
  echart: ECharts | undefined
  private treeOptions
  private graphOptions
  private nodes: Nodes[]
  private links: Links[]
  private tree: Tree
  private versions: Versions
  private treeNodeMap = new Map()

  constructor(private relations: Relations) {
    const { nodes, links } = genGraph(this.relations.__root__)
    const tree = genTree(1, relations)
    const versions = genVersions(relations)
    this.nodes = nodes
    this.links = links
    this.tree = tree
    this.versions = versions
    this.treeOptions = loadTreeOptions(this.tree)
    this.graphOptions = loadGraphOptions(this.nodes, this.links)
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
    }
    this.echart?.setOption(graphChartOption(this.nodes, this.links))
  }

  mountChart(chart: ECharts) {
    this.echart = chart
    const options = {
      tooltip: {},
      animationThreshold: 16777216,
      hoverLayerThreshold: 16777216,
      textStyle: {
        fontSize: 13,
      },
      ...this.graphOptions,
    }
    this.echart.setOption(options)
  }

  toggleLegend(legend: string) {
    this.echart?.setOption(
      legend === 'Force'
        ? this.treeOptions
        : this.graphOptions,
    )
    return legend === 'Force' ? 'Tree' : 'Force'
  }

  getPkgInfo(name: string): PkgInfo {
    const { relatedPkg } = fuzzySearch(name, this.relations)
    return {
      __info__: relatedPkg,
      __circulation__: getCirculation?.(name, this.relations),
      __versions__: this.versions?.[name],
    }
  }

  addTreeNode(ancestors: any, data: any) {
    // echarts 对相同名字的标签会动画重叠，这里用 -- 区分一下
    const selectName = data.name.split('--')[0]
    const { dependencies, devDependencies } = this.relations[selectName] ?? {}
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
        name: `${pkgName}--${pkgVersion}`,
        value: pkgVersion,
        children: [],
      })
    }
    this.echart?.setOption(treeChartOption(this.tree))
  }

  removeTreeNode(data: any) {
    const node = this.treeNodeMap.get(data.name)
    node && (node.collapsed = true)
    this.treeNodeMap.delete(data.name)
    this.echart?.setOption(treeChartOption(this.tree))
  }

  collapseAllTreeNode() {
    for (const map of this.treeNodeMap.values())
      map.collapsed = true
    this.treeNodeMap.clear()
    this.echart?.setOption(treeChartOption(this.tree))
  }

  collapseGraphNode() {
    const { nodes, links } = genGraph(this.relations.__root__)
    this.nodes = nodes
    this.links = links
    this.echart?.setOption(graphChartOption(this.nodes, this.links))
  }
}
