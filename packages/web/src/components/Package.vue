<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import echarts from '../plugins/echarts'
import { Chart, debounce, initData } from '../utils/index'
import JsonView from './JsonView.vue'

const graphSet = new Set()
const lengend = ref<'tree' | 'force'>('tree')
const pkg = ref()
const pkgInfo = ref()
const { nodes, links, tree, relations, versions } = await initData()
const c = new Chart(nodes, links, tree, relations, versions)
const handleSearch = debounce(() => {
  const searchResult = c.fuzzySearch(pkg.value)
  if (searchResult) {
    pkgInfo.value = {
      依赖名: searchResult,
      循环引用: c.getCirculation(searchResult.name),
      多版本: c.getVersions(searchResult.name),
    }
  }
})

onMounted(async () => {
  const chartInstance = echarts.init(document.getElementById('chart'))
  c.mountChart(chartInstance)
  chartInstance.on('click', (params: any) => {
    const { data, seriesType, collapsed } = params
    if (!collapsed) {
      pkg.value = data.name
      pkgInfo.value = {
        依赖名: c.getRelation(data.name),
        循环引用: c.getCirculation(data.name),
        多版本: c.getVersions(data.name),
      }
    }
    if (seriesType === 'graph' && !graphSet.has(data.name)) {
      graphSet.add(data.name)
      c.addGraph(data.name)
    }
  })
})

onUnmounted(() => {
  c.echart?.off('click')
  c.echart?.off('legendselectchanged')
  c.echart?.dispose()
})
</script>

<template>
  <div id="chart" style="flex: 1" />
  <div class="f-wrap-column" style="width: 320px;">
    <button @click="lengend = c.toggleLegend(lengend)">
      ff
    </button>
    <input v-model="pkg" class="pkgSearch" placeholder="请输入查找的包名" type="text" @input="handleSearch">
    <JsonView :data="pkgInfo" />
  </div>
</template>

<style scoped>
input {
  box-sizing: border-box;
}
.f-wrap-column {
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
}

.pkgSearch {
  outline-style: none ;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 12px 8px;
  font-size: 26px;
  width: 100%;
}
</style>
