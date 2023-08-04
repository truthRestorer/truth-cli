<!-- eslint-disable no-console -->
<script setup lang="ts">
import { onMounted } from 'vue'
import echarts from '../plugins/echarts'
import { initChartData } from '../utils/index'

const { relations, nodes, links, options } = await initChartData()

const graphSet = new Map()

onMounted(async () => {
  const myChart = echarts.init(document.getElementById('main'))
  // 绘制图表
  myChart.setOption(options)
  myChart.on('click', ({ data, seriesType }: any) => {
    if (seriesType === 'graph') {
      let changedNodes = nodes
      const nodesName = nodes.map((item: any) => item.name)
      const relation = relations[data.name]
      const deps = Object.assign({}, relation?.devDependencies, relation?.dependencies)
      if (graphSet.get(data.name)) {
        changedNodes = nodes.filter((item: any) => !Object.keys(deps).includes(item.name))
        graphSet.set(data.name, 0)
      }
      else {
        const gSet = graphSet.get(data.name)
        for (const [pkgName, pkgVersion] of Object.entries(deps)) {
          gSet || links.push({
            source: data.name,
            target: pkgName,
            v: pkgVersion,
          })
          if (!nodesName.includes(pkgName)) {
            changedNodes.push({
              name: pkgName,
              version: pkgVersion,
              category: 0,
            })
          }
        }
        graphSet.set(data.name, 1)
      }
      myChart.setOption({
        series: [
          {
            name: '引力关系图',
            nodes: changedNodes,
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
