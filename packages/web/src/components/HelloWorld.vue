<!-- eslint-disable @typescript-eslint/ban-ts-comment -->
<script setup lang="ts">
import * as echarts from 'echarts'
import { onMounted } from 'vue'
import { categories } from '../types'

const res = await fetch('charts.json')
const { nodes, links, relations } = await res.json()

onMounted(() => {
  const myChart = echarts.init(document.getElementById('main'))
  // 绘制图表
  myChart.setOption({
    series: [
      {
        type: 'graph',
        layout: 'force',
        nodes,
        links,
        categories,
        label: {
          show: false,
        },
        symbolSize: 15,
        draggable: true,
        force: {
          repulsion: 150,
          gravity: 0.05
        },
        roam: true,
        emphasis: {
          lineStyle: {
            width: 5,
          },
        },
      },
    ],
    animationDuration: 1500,
    animationEasingUpdate: 'quinticInOut',
    legend: {
      data: categories.map(a => a.name),
    },
    tooltip: {},
    color: [
      '#73c0de',
      '#3ba272',
      '#5470c6',
    ]
  })
  myChart.on('click', (param: any) => {
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
  height: max-content;
}

#main:first-child {
  min-height: 100vh;
}
</style>
