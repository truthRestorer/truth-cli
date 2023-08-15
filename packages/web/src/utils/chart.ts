import type { ECharts } from 'echarts/core'
import type { Links, Nodes, Relations, Tree, Versions } from '@truth-cli/shared'
import { assign, isEmptyObj } from '@truth-cli/shared/src/tools'
import { categories } from '@truth-cli/shared/src/types'

export class Chart {
  private nodesSet: Set<string>
  echart: ECharts | undefined
  private rootName: string
  private treeOptions
  private graphOptions
  constructor(
    private nodes: Nodes[],
    private links: Links[],
    private tree: Tree[],
    private relations: Relations,
    private versions: Versions,
  ) {
    this.nodesSet = new Set(nodes.map((item: Nodes) => item.name))
    this.rootName = relations.__root__.name
    this.treeOptions = {
      series: {
        name: 'Tree',
        type: 'tree',
        left: '3%',
        bottom: '6%',
        top: '6%',
        data: [this.tree],
        roam: true,
        symbolSize: 10,
        label: {
          show: true,
          position: 'right',
        },
        initialTreeDepth: 1,
        expandAndCollapse: true,
      },
    }
    this.graphOptions = {
      series: {
        name: 'Force',
        type: 'graph',
        layout: 'force',
        nodes: this.nodes,
        links: this.links,
        categories,
        draggable: false,
        symbolSize: 14,
        label: {
          show: true,
          position: 'top',
        },
        force: {
          repulsion: 350,
          layoutAnimation: true,
          friction: 0.15,
        },
        roam: true,
      },
    }
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
      animationThreshold: 65536,
      hoverLayerThreshold: 65536,
      ...this.graphOptions,
    }
    this.echart.setOption(options)
  }

  toggleLegend(legend: string) {
    if (legend === 'Force') {
      this.echart?.setOption(this.treeOptions)
      return 'Tree'
    }
    this.echart?.setOption(this.graphOptions)
    return 'Force'
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
    return result.length ? result : null
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

  getPkgInfo(name: string) {
    const { relatedPkg, relatedName } = this.fuzzySearch(name)
    const result: any = {}
    if (relatedName && relatedPkg)
      result[`${relatedName}`] = relatedPkg
    if (this.getCirculation(name))
      result['循环引用'] = this.getCirculation(name)
    if (this.versions[name])
      result['多个版本'] = this.versions[name]
    return isEmptyObj(result) ? '没有找到该包的信息喔' : result
  }
}
