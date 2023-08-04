import { categories } from '../types'

export async function initChartData() {
  const graph = await fetch('graph.json')
  const { nodes, links } = await graph.json()
  const treeJSON = await fetch('tree.json')
  const tree = await treeJSON.json()
  const relationsJSON = await fetch('relations.json')
  const options = {
    legend: {
      data: ['引力关系图', '树状图1', '树状图2'],
      selectedMode: 'single',
      zlevel: 3,
    },
    animationThreshold: 2 ** 32,
    hoverLayerThreshold: 2 ** 32,
    tooltip: {},
    series: [
      {
        name: '引力关系图',
        zlevel: 1,
        type: 'graph',
        layout: 'force',
        nodes,
        links,
        categories,
        draggable: false,
        label: {
          show: true,
          position: 'right',
        },
        force: {
          repulsion: 150,
        },
        roam: true,
      },
      {
        name: '树状图1',
        zlevel: 2,
        type: 'tree',
        data: [tree[0]],
        roam: true,
        label: {
          show: true,
        },
        initialTreeDepth: 1,
        expandAndCollapse: true,
      },
      {
        name: '树状图2',
        zlevel: 2,
        type: 'tree',
        data: [tree[1]],
        roam: true,
        label: {
          show: true,
        },
        initialTreeDepth: 1,
        expandAndCollapse: true,
      },
    ],
  }
  const relations = await relationsJSON.json()
  return Object.freeze({
    relations,
    tree,
    nodes,
    links,
    options,
  })
}
