<!-- eslint-disable no-console -->
<script setup lang="ts">
import { onMounted } from 'vue'
import echarts from '../plugins/echarts'
import { categories } from '../types'
import { initChartData } from '../utils/index'

const { nodes, links, tree, relations } = await initChartData()

function circulatePkg(name: any) {
  const circulation = []
  const filteredLinks = links.filter((item: any) => item.source === name)
  const linkedTarget = filteredLinks.map((item: any) => item.target)
  for (let i = 0; i < linkedTarget.length; i++) {
    const { dependencies, devDependencies } = relations[linkedTarget[i]] ?? {}
    const link = Object.assign({}, dependencies, devDependencies)
    if (Object.keys(link).includes(name))
      circulation.push(linkedTarget[i])
  }
  return circulation
}

onMounted(async () => {
  const myChart = echarts.init(document.getElementById('main'))
  // 绘制图表
  myChart.setOption({
    legend: {
      data: ['树状图', '引力关系图'],
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
    // 该包的信息
    const relation = relations[param.data.name]
    console.log('包的详细信息:', relation)
    // 与该包重复引用的包
    const circulation = circulatePkg(param.data.name)
    console.log('与该包重复引用的包', circulation)
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
