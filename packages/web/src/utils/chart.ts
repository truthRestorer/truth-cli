import type { ECharts } from 'echarts/core'
import type { Links, Nodes, Relations, Tree, Versions } from '@truth-cli/shared'
import { assign, isEmptyObj } from '@truth-cli/shared'
import { genGraph, genTree, genVersions } from '@truth-cli/core'
import type { PkgInfo } from '../types'
import { loadGraphOptions, loadTreeOptions } from './chartOptions'

export class Chart {
  private nodesSet: Set<string>
  echart: ECharts | undefined
  private rootName: string
  private treeOptions
  private graphOptions
  private nodes: Nodes[]
  private links: Links[]
  private tree: Tree
  private versions: Versions

  constructor(private relations: Relations) {
    const { nodes, links } = genGraph(relations)
    const tree = genTree(2, relations)
    const versions = genVersions(relations)
    this.nodes = nodes
    this.links = links
    this.tree = tree
    this.versions = versions
    this.nodesSet = new Set(nodes.map((item: Nodes) => item.name))
    this.rootName = relations.__root__.name
    this.treeOptions = loadTreeOptions(this.tree)
    this.graphOptions = loadGraphOptions(this.nodes, this.links)
  }

  addGraph(name: string) {
    if (name === this.rootName || !this.relations[name])
      return
    const { devDependencies, dependencies } = this.relations[name]
    const deps = assign(devDependencies, dependencies)
    if (isEmptyObj(deps))
      return
    for (const [pkgName, pkgVersion] of Object.entries(deps)) {
      this.links.push({
        source: pkgName,
        target: name,
      })
      if (!this.nodesSet.has(pkgName)) {
        this.nodes.push({
          name: pkgName,
          value: pkgVersion as string,
          category: 0,
        })
        this.nodesSet.add(pkgName)
      }
    }
    this.echart?.setOption(this.graphOptions)
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
    this.echart?.setOption(legend === 'Force' ? this.treeOptions : this.graphOptions)
    return legend === 'Force' ? 'Tree' : 'Force'
  }

  private getCirculation(name: string) {
    if (!this.relations[name])
      return
    const { devDependencies, dependencies } = this.relations[name]
    const pkgs = assign(devDependencies, dependencies)
    const result = []
    for (const pkg of Object.keys(pkgs)) {
      if (this.relations[pkg]) {
        const { devDependencies, dependencies } = this.relations[pkg]
        const relationPkg = assign(devDependencies, dependencies)
        if (Object.keys(relationPkg).includes(name))
          result.push(pkg)
      }
    }
    return result.length ? result : undefined
  }

  private fuzzySearch(name: string) {
    const relatedPkg = this.relations[name]
    if (relatedPkg) {
      return {
        relatedPkg,
        relatedName: name,
      }
    }
    const findPkgKey = Object.keys(this.relations).find((key) => {
      return key.toLocaleLowerCase().includes(name.toLocaleLowerCase())
    })
    if (!findPkgKey)
      return {}
    return {
      relatedPkg: this.relations[findPkgKey],
      relatedName: findPkgKey,
    }
  }

  getPkgInfo(name: string): PkgInfo {
    const { relatedPkg } = this.fuzzySearch(name)
    return {
      __info__: relatedPkg,
      __circulation__: this.getCirculation?.(name),
      __versions__: this.versions?.[name],
    }
  }

  addTreeNode(ancestors: any, data: any) {
    if (!data.children || data.children.length)
      return
    let child = this.tree.children
    for (let i = 2; i < ancestors.length; i++) {
      const subChild = child?.find((item: any) => item.name === ancestors[i].name)
      if (subChild) {
        subChild!.collapsed = false
        child = subChild?.children
      }
    }
    const relation = this.relations[data.name]
    if (relation) {
      const { dependencies, devDependencies } = relation
      const pkg = assign(dependencies, devDependencies)
      for (const pkgName of Object.keys(pkg)) {
        child?.push({
          name: pkgName,
          value: data.value,
          children: [],
        })
      }
      this.echart?.setOption(this.treeOptions)
    }
  }
}
