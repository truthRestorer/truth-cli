<!-- eslint-disable no-console -->
<script setup lang="ts">
import { onMounted } from 'vue'
import echarts from '../plugins/echarts'
import { initChartData } from '../utils/index'

const { relations, nodes, links, options } = await initChartData()

onMounted(async () => {
  const myChart = echarts.init(document.getElementById('main'))
  // 绘制图表
  myChart.setOption(options)
  myChart.on('click', ({ data, seriesType }: any) => {
    if (seriesType === 'graph') {
      const nodesName = nodes.map((item: any) => item.name)
      const relation = relations[data.name]
      const deps = Object.assign({}, relation?.devDependencies, relation?.dependencies)
      for (const [pkgName, pkgVersion] of Object.entries(deps)) {
        links.push({
          source: data.name,
          target: pkgName,
          v: pkgVersion,
        })
        if (!nodesName.includes(pkgName)) {
          nodes.push({
            name: pkgName,
            version: pkgVersion,
            category: 0,
          })
        }
      }
      myChart.setOption({
        series: [
          {
            name: '引力关系图',
            nodes,
            links,
          },
        ],
      })
    }
    console.log(data)
    // 该包的信息
    const relation = relations[data.name]
    console.log('包的详细信息:', relation)
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
