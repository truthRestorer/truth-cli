import type { ECharts } from 'echarts/core'
import type { ILinks, INodes, IRelations, ITree, IVersions } from '@truth-cli/shared'
import { assign, isEmptyObj } from '@truth-cli/shared/src/tools'
import { categories } from '@truth-cli/shared/src/types'

export class Chart {
  private nodesSet: Set<string>
  echart: ECharts | undefined
  private rootName: string
  constructor(
    private nodes: INodes[],
    private links: ILinks[],
    private tree: ITree[],
    private relations: IRelations,
    private versions: IVersions,
  ) {
    this.nodesSet = new Set(nodes.map((item: INodes) => item.name))
    this.rootName = relations.__root__.name
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
        v: pkgVersion as string,
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
    this.reSetChartOptions()
  }

  mountChart(chart: ECharts) {
    this.echart = chart
    const options = {
      tooltip: {},
      animationThreshold: 65536,
      hoverLayerThreshold: 65536,
      series: {
        name: '树图',
        type: 'tree',
        left: '3%',
        bottom: '8%',
        top: '3%',
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
    this.echart.setOption(options)
  }

  private reSetChartOptions() {
    this.echart?.setOption({
      series: [
        {
          name: '引力图',
          nodes: this.nodes,
          links: this.links,
        },
      ],
    })
  }

  toggleLegend(legend: string) {
    if (legend === 'Force') {
      this.echart?.setOption({
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
      })
      return 'Tree'
    }
    this.echart?.setOption({
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
    })
    return 'Force'
  }

  getRelation(name: string) {
    const relation = this.relations[name]
    return relation
  }

  getCirculation(name: string) {
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
    return result
  }

  getVersions(name: string) {
    return this.versions[name] ?? []
  }

  fuzzySearch(name: string) {
    const relatedPkg = this.relations[name]
    if (relatedPkg)
      return relatedPkg
    const findPkg = Object.keys(this.relations).find((key) => {
      return key.toLocaleLowerCase().includes(name.toLocaleLowerCase())
    })
    if (!findPkg)
      return {}
    return this.relations[findPkg]
  }
}
