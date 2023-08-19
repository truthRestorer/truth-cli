import type { Links, Nodes, Tree } from '@truth-cli/shared'
import { categories } from '@truth-cli/shared'

export function loadTreeOptions(tree: Tree) {
  return {
    series: {
      name: 'Tree',
      type: 'tree',
      left: '30%',
      right: '25%',
      bottom: '2%',
      top: '1%',
      data: [tree],
      roam: true,
      symbolSize: 0,
      tooltip: {
        triggerOn: 'mousemove',
        formatter: (params: any) => {
          return params.name.split('--')[0]
        },
      },
      label: {
        position: 'left',
        verticalAlign: 'middle',
        align: 'right',
        width: 10,
        lineHeight: 24,
        formatter(params: any) {
          const name = params.name.split('--')[0]
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
}

export function loadGraphOptions(nodes: Nodes[], links: Links[]) {
  return {
    series: {
      name: 'Force',
      type: 'graph',
      layout: 'force',
      right: '30%',
      nodes,
      links,
      categories,
      draggable: false,
      symbolSize: 22,
      tooltip: {},
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
