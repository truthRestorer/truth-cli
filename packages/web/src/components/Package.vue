<script setup lang="ts">
import { onMounted, ref } from 'vue'
import echarts from '../plugins/echarts'
import { Chart, initData } from '../utils/index'

const pkg = ref()
const pkgDescription = ref()
const pkgVersions = ref()
const pkgCirculated = ref()
const { nodes, links, tree, relations, versions } = await initData()
const c = new Chart(nodes, links, tree, relations, versions)

function handlerSearch() {
  const searchResult = c.fuzzySearch(pkg.value)
  if (searchResult) {
    pkgDescription.value = searchResult
    pkgVersions.value = c.getVersions(searchResult.name)
    pkgCirculated.value = c.circulatedPkg(searchResult.name)
  }
}

onMounted(async () => {
  const chartInstance = echarts.init(document.getElementById('chart'))
  c.mountChart(chartInstance)
  chartInstance.on('click', ({ data, seriesType }: any) => {
    pkg.value = data.name
    pkgDescription.value = c.getRelation(data.name)
    pkgVersions.value = c.getVersions(data.name)
    pkgCirculated.value = c.circulatedPkg(data.name)
    if (seriesType === 'graph')
      c.addGraph(data.name)
  })
})
</script>

<template>
  <div id="chart" style="height: 100%;width: 65%;left: 20%;" />
  <div class="info">
    <input v-model="pkg" class="pkgSearch" placeholder="请输入查找的包名" type="text" @input="handlerSearch">
    <json-viewer
      :expand-depth="2"
      :value="pkgDescription"
      copyable
      boxed
      expanded
      style="height: 90vh;overflow: auto;overflow-x: hidden;"
    />
  </div>
  <div class="versions">
    <div>
      <span>各个版本</span>
      <json-viewer
        :expand-depth="2"
        :value="pkgVersions"
        :show-array-index="false"
        copyable
        boxed
        expanded
        style="height: 45vh;overflow: auto;overflow-x: hidden;"
      />
    </div>
    <div>
      <span>循环引用</span>
      <json-viewer
        :expand-depth="2"
        :value="pkgCirculated"
        :show-array-index="false"
        copyable
        boxed
        expanded
        style="height: 45vh;overflow: auto;overflow-x: hidden;"
      />
    </div>
  </div>
</template>

<style scoped>
.versions, .info {
  position: absolute;
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  right: 0;
  top: 0;
  width: 15%;
  height: 100vh;
}
.info {
  left: 0;
  width: 20%;
}
.pkgSearch {
  outline-style: none ;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 14px 14px;
  font-size: 24px;
}
</style>
