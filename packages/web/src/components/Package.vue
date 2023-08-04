<!-- eslint-disable no-console -->
<script setup lang="ts">
import { onMounted } from 'vue'
import echarts from '../plugins/echarts'
import { Chart, initData } from '../utils/index'

const chartData = await initData()
onMounted(async () => {
  const chartInstance = echarts.init(document.getElementById('main'))
  const c = new Chart(chartData, chartInstance)
  chartInstance.on('click', ({ data, seriesType }: any) => {
    if (seriesType === 'graph')
      c.addGraph(data.name)
    console.log(data)
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
