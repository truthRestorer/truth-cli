<!-- eslint-disable no-console -->
<script setup lang="ts">
import { onMounted } from 'vue'
import echarts from '../plugins/echarts'
import { categories } from '../types'

const graph = await fetch('graph.json')
const { nodes, links } = await graph.json()
const treeJSON = await fetch('tree.json')
const tree = await treeJSON.json()
const relationsJSON = await fetch('relations.json')
const relations = await relationsJSON.json()

onMounted(async () => {
  const myChart = echarts.init(document.getElementById('main'))
  // 绘制图表
  myChart.setOption({
    legend: {
      data: ['引力关系图', '树状图'],
      selectedMode: 'single',
      animation: true,
      zlevel: 3,
    },
    animationThreshold: 2 ** 32,
    hoverLayerThreshold: 2 ** 32,
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
          show: false,
        },
        force: {
          repulsion: 150,
        },
        roam: true,
      },
      {
        name: '树状图',
        zlevel: 2,
        type: 'tree',
        data: [tree],
        roam: true,
        label: {
          show: true,
        },
        initialTreeDepth: 1,
        expandAndCollapse: true,
      },
    ],
  })
  myChart.on('click', (param: any) => {
    console.log(param)
    const relation = relations[param.data.name]
    console.log(relation)
  })
})
</script>

<template>
  <div id="main" />
</template>

<style scoped>
#main {
  width: 100%;
  height: 100vh;
}
</style>
