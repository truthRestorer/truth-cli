<!-- eslint-disable no-console -->
<script setup lang="ts">
import { onMounted } from 'vue'
import echarts from '../plugins/echarts'

// import * as echarts from 'echarts'

import { categories } from '../types'

const res = await fetch('graph.json')
const { nodes, links, relations } = await res.json()

onMounted(() => {
  const myChart = echarts.init(document.getElementById('main'))
  // 绘制图表
  myChart.setOption({
    animation: false,
    series: [
      {
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
          repulsion: 500,
          layoutAnimation: false,
        },
        roam: true,
      },
      {
        type: 'tree',
      },
    ],
    tooltip: {
      show: true,
    },
    color: [
      '#73c0de',
      '#5470c6',
    ],
    toolbox: {
      feature: {
        magicType: {
          type: ['tree', 'graph'],
        },
      },
    },
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
  height: max-content;
}

#main:first-child {
  min-height: 100vh;
}
</style>
