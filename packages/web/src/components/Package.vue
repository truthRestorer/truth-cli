<!-- eslint-disable no-console -->
<script setup lang="ts">
import { onMounted } from 'vue'
import echarts from '../plugins/echarts'
import { Chart, initData } from '../utils/index'

const chartData = await initData()
// TODO: 显示同个包不同版本，做法：通过 relations.json 做到
// TODO: 希望左边有个能显示对象的方框，用户输入包名可查找相应信息
onMounted(async () => {
  const chartInstance = echarts.init(document.getElementById('main'))
  const c = new Chart(chartData, chartInstance)
  chartInstance.on('click', ({ data, seriesType }: any) => {
    if (seriesType === 'graph')
      c.addGraph(data.name)
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
