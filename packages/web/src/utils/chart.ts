import type { ECharts } from 'echarts/core'
import type { Links, Nodes, Relations, Tree, Versions } from '@truth-cli/shared'
import { assign, categories, isEmptyObj } from '@truth-cli/shared'
import { genGraph, genTree, genVersions } from '@truth-cli/core'

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
    const tree = genTree(3, relations)
    const versions = genVersions(relations)
    this.nodes = nodes
    this.links = links
    this.tree = tree
    this.versions = versions
    this.nodesSet = new Set(nodes.map((item: Nodes) => item.name))
    this.rootName = relations.__root__.name
    this.treeOptions = {
      series: {
        name: 'Tree',
        type: 'tree',
        left: '30%',
        right: '25%',
        bottom: '2%',
        top: '1%',
        data: [this.tree],
        roam: true,
        symbolSize: 0,
        tooltip: {
          triggerOn: 'mousemove',
        },
        label: {
          position: 'left',
          verticalAlign: 'middle',
          align: 'right',
          width: 10,
          lineHeight: 24,
          formatter(params: any) {
            if (params.treeAncestors.length === 2)
              return `{a|${params.name}}`
            else if (params.treeAncestors.length === 3)
              return `{b|${params.name}}`
            else if (params.treeAncestors.length === 4)
              return `{c|${params.name}}`
            else
              return `{d|${params.name}}`
          },
          rich: {
            a: {
              padding: 4,
              color: '#fff',
              borderRadius: 4,
              backgroundColor: '#222',
            },
            b: {
              padding: 4,
              color: '#fff',
              borderRadius: 4,
              backgroundColor: '#551A7B',
            },
            c: {
              padding: 4,
              color: '#fff',
              borderRadius: 4,
              backgroundColor: '#EC6E49',
            },
            d: {
              padding: 4,
              color: '#fff',
              borderRadius: 4,
              backgroundColor: '#546FD6',
            },
          },
        },
        leaves: {
          label: {
            position: 'right',
            verticalAlign: 'middle',
            align: 'left',
          },
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
        right: '30%',
        nodes: this.nodes,
        links: this.links,
        categories,
        draggable: false,
        symbolSize: 22,
        label: {
          show: true,
          position: 'top',
        },
        force: {
          repulsion: 900,
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
      animationThreshold: 16777216,
      hoverLayerThreshold: 16777216,
      textStyle: {
        fontSize: 14,
      },
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

  addTreeNode(ancestors: any, data: any) {
    if (data.children === undefined || data.children.length > 0)
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
