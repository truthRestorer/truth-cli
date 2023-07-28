<!-- eslint-disable @typescript-eslint/ban-ts-comment -->
<script setup lang="ts">
import * as echarts from 'echarts'
import { onMounted } from 'vue'
import { links, nodes } from '../assets/charts.json'
import { categories } from '../types'

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
          show: true,
        },
        symbolSize: 15,
        draggable: false,
        force: {
          repulsion: 300,
        },
        roam: true,
        emphasis: {
          // @ts-expect-error
          focus: 'adjacency',
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
