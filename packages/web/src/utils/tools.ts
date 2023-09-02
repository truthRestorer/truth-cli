import type { Links, Nodes, Tree } from '@truth-cli/shared'
import { formatName } from './index'

export function loadTree(tree: Tree) {
  const richStyle = {
    padding: 4,
    color: '#fff',
    borderRadius: 4,
  }
  return {
    series: {
      name: 'Tree',
      type: 'tree',
      right: '20%',
      bottom: '15',
      top: '65',
      data: [tree],
      symbolSize: 0,
      tooltip: {
        formatter: (params: any) => {
          const name = formatName(params.name)
          const value = params.value
          return `${name} ${value}`
        },
      },
      roam: true,
      label: {
        show: true,
        formatter(params: any) {
          const name = formatName(params.name)
          if (params.treeAncestors.length === 2)
            return `{a|${name}}`
          if (params.treeAncestors.length === 3)
            return `{b|${name}}`
          else if (params.treeAncestors.length === 4)
            return `{c|${name}}`
          return `{d|${name}}`
        },
        rich: {
          a: {
            ...richStyle,
            backgroundColor: '#222',
          },
          b: {
            ...richStyle,
            backgroundColor: '#551A7B',
          },
          c: {
            ...richStyle,
            backgroundColor: '#EC6E49',
          },
          d: {
            ...richStyle,
            backgroundColor: '#546FD6',
          },
        },
      },
      leaves: {
        label: {
          align: 'left',
        },
      },
      initialTreeDepth: 1,
      expandAndCollapse: true,
    },
  }
}

export function loadGraph(nodes: Nodes[], links: Links[]) {
  return {
    tooltip: {},
    animationThreshold: 16777216,
    hoverLayerThreshold: 16777216,
    series: {
      name: 'Graph',
      type: 'graph',
      layout: 'force',
      nodes,
      links,
      edgeSymbol: ['arrow', 'none'],
      edgeSymbolSize: 8,
      categories: [
        { name: '依赖' },
        { name: '项目依赖' },
        { name: '项目名' },
      ],
      cursor: 'pointer',
      symbolSize: 28,
      label: {
        show: true,
        position: 'top',
      },
      force: {
        repulsion: 1400,
        friction: 0.15,
      },
      roam: true,
      draggable: true,
    },
  }
}
