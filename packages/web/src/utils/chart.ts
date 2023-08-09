import type { ECharts } from 'echarts/core'
import type { ILinks, INodes, IRelations, ITree, IVersions } from '@truth-cli/shared'
import { assign, categories, isEmptyObj } from '@truth-cli/shared'

export class Chart {
  private graphSet = new Set()
  private nodesSet: Set<string>
  private echart: ECharts | undefined
  private rootName: string
  constructor(
    private nodes: INodes[],
    private links: ILinks[],
    private tree: ITree[],
    private relations: IRelations,
    private versions: IVersions,
  ) {
    this.nodesSet = new Set(nodes.map((item: any) => item.name))
    this.versions = versions
    this.rootName = relations.__root__.name
  }

  addGraph(name: string) {
    if (name === this.rootName || this.graphSet.has(name))
      return
    this.graphSet.add(name)
    if (!this.relations[name])
      return
    const { devDependencies, dependencies } = this.relations[name]
    const deps = Object.assign({}, devDependencies, dependencies)
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
    this.setChartOptions()
  }

  mountChart(chart: ECharts) {
    this.echart = chart
    const options = {
      tooltip: {},
      legend: {
        data: ['树图', '引力图'],
        selectedMode: 'single',
        itemHeight: 18,
        itemWidth: 18,
        itemGap: 25,
      },
      animationThreshold: 65536,
      hoverLayerThreshold: 65536,
      series: [
        {
          name: '引力图',
          type: 'graph',
          layout: 'force',
          nodes: this.nodes,
          links: this.links,
          categories,
          draggable: false,
          label: {
            show: true,
            position: 'right',
          },
          force: {
            repulsion: 150,
            layoutAnimation: true,
            friction: 0.2,
          },
          roam: true,
        },
        {
          name: '树图',
          type: 'tree',
          data: [this.tree],
          roam: true,
          label: {
            show: true,
          },
          initialTreeDepth: 1,
          expandAndCollapse: true,
        },
      ],
    }
    this.setChartOptions(options)
  }

  private setChartOptions(options?: any) {
    if (options) {
      this.echart?.setOption(options)
      return
    }
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

  getRelation(name: string) {
    const relation = this.relations[name]
    return relation
  }

  circulatedPkg(name: string) {
    if (!this.relations[name])
      return
    const { devDependencies, dependencies } = this.relations[name]
    const pkgs = assign(devDependencies, dependencies)
    const result = []
    for (const pkg of Object.keys(pkgs) as any) {
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
    return this.versions[name] ?? this.relations[name]?.version ?? []
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
