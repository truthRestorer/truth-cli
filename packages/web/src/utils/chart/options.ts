import type { Links, Nodes, Tree } from '@truth-cli/shared'
import { preDealName } from '../preDealName'
import { categories } from '../../types'
import type { Legend } from '../../types'

export function loadTreeOptions(tree: Tree) {
  const richStyle = {
    padding: 4,
    color: '#fff',
    borderRadius: 4,
  }
  return {
    series: {
      name: 'Tree',
      type: 'tree',
      left: '30%',
      right: '25%',
      bottom: '2%',
      top: '2%',
      data: [tree],
      symbolSize: 0,
      tooltip: {
        formatter: (params: any) => {
          const name = preDealName(params.name)
          const value = params.value
          return `${name} ${value}`
        },
      },
      roam: true,
      label: {
        show: true,
        formatter(params: any) {
          const name = preDealName(params.name)
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

export function loadGraphOptions(nodes: Nodes[], links: Links[]) {
  return {
    series: {
      name: 'Graph',
      type: 'graph',
      layout: 'force',
      nodes,
      links,
      categories,
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
    },
  }
}

export function resetOptions(type: Legend, data: {
  tree?: Tree
  nodes?: Nodes[]
  links?: Links[]
}) {
  if (type === 'Tree') {
    return {
      series: {
        name: 'Tree',
        data: [data.tree],
      },
    }
  }
  return {
    series: {
      name: 'Force',
      nodes: data.nodes,
      links: data.links,
    },
  }
}
