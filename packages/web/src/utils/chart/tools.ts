import type { Links, Nodes, Tree } from '@truth-cli/shared'
import { formatName } from '../formatName'
import { categories } from '../../types'

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
    series: {
      name: 'Graph',
      type: 'graph',
      layout: 'force',
      nodes,
      links,
      categories,
      cursor: 'pointer',
      symbolSize: 22,
      label: {
        show: true,
        position: 'top',
      },
      force: {
        repulsion: 900,
        friction: 0.15,
      },
      roam: true,
      draggable: true,
    },
  }
}
