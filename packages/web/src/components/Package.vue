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

onMounted(() => {
  const myChart = echarts.init(document.getElementById('main'))

  // 绘制图表
  myChart.setOption({
    legend: {
      data: ['引力关系图', '树状图'],
      selectedMode: 'single',
    },
    series: [
      {
        name: '引力关系图',
        type: 'graph',
        layout: 'force',
        nodes,
        links,
        categories,
        animation: false,
        label: {
          show: false,
        },
        draggable: false,
        force: {
          repulsion: 150,
        },
        roam: true,
      },
      {
        name: '树状图',
        type: 'tree',
        data: [tree],
        roam: true,
        label: {
          show: true,
        },
        initialTreeDepth: 1,
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
