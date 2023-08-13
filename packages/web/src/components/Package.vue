<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import echarts from '../plugins/echarts'
import { Chart, debounce, initData } from '../utils/index'
import JsonView from './JsonView.vue'

const graphSet = new Set()
const lengend = ref<'树图' | '引力图'>('树图')
const pkg = ref()
const pkgInfo = ref()
const pkgVersions = ref()
const pkgCirculated = ref()
const { nodes, links, tree, relations, versions } = await initData()
const c = new Chart(nodes, links, tree, relations, versions)
const handleSearch = debounce(() => {
  const searchResult = c.fuzzySearch(pkg.value)
  if (searchResult) {
    pkgInfo.value = searchResult
    pkgVersions.value = c.getVersions(searchResult.name)
    pkgCirculated.value = c.getCirculation(searchResult.name)
  }
})

onMounted(async () => {
  const chartInstance = echarts.init(document.getElementById('chart'))
  c.mountChart(chartInstance)
  chartInstance.on('click', (params: any) => {
    const { data, seriesType, collapsed } = params
    if (!collapsed) {
      pkg.value = data.name
      pkgInfo.value = c.getRelation(data.name)
      pkgVersions.value = c.getVersions(data.name)
      pkgCirculated.value = c.getCirculation(data.name)
    }
    if (seriesType === 'graph' && !graphSet.has(data.name)) {
      graphSet.add(data.name)
      c.addGraph(data.name)
    }
  })
  chartInstance.on('legendselectchanged', (params: any) => {
    lengend.value = params.name
  })
})
onUnmounted(() => {
  c.echart?.off('click')
  c.echart?.off('legendselectchanged')
  c.echart?.dispose()
})
</script>

<template>
  <div style="height: 100vh;display: flex;">
    <div class="f-wrap-column" style="width: 280px;">
      <input v-model="pkg" class="pkgSearch" placeholder="请输入查找的包名" type="text" @input="handleSearch">
      <JsonView :data="pkgInfo" />
    </div>
    <div id="chart" style="flex: 1" />
    <div class="f-wrap-column" style="width: 250px;">
      <div class="f-wrap-column version">
        <span class="pkgTitle">各个版本</span>
        <JsonView :data="pkgVersions" />
      </div>
      <div class="f-wrap-column version">
        <span class="pkgTitle">循环引用</span>
        <JsonView :data="pkgCirculated" />
      </div>
    </div>
  </div>
</template>

<style scoped>
div, input {
  box-sizing: border-box;
}
.f-wrap-column {
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
}

.version {
  flex: 1;
  overflow: hidden;
}

.pkgSearch {
  outline-style: none ;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 12px 8px;
  font-size: 26px;
  width: 100%;
}
.pkgTitle {
  text-align: center;
  padding: 8px;
  font-weight: 700;
}
</style>
