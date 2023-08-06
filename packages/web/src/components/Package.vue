<script setup lang="ts">
import type { CSSProperties } from 'vue'
import { onMounted, ref } from 'vue'
import echarts from '../plugins/echarts'
import { Chart, initData } from '../utils/index'

const pkg = ref()
const pkgInfo = ref()
const pkgVersions = ref()
const pkgCirculated = ref()
const { nodes, links, tree, relations, versions } = await initData()
const c = new Chart(nodes, links, tree, relations, versions)

function handlerSearch() {
  const searchResult = c.fuzzySearch(pkg.value)
  if (searchResult) {
    pkgInfo.value = searchResult
    pkgVersions.value = c.getVersions(searchResult.name)
    pkgCirculated.value = c.circulatedPkg(searchResult.name)
  }
}

const jsonViewerStyle: CSSProperties = {
  'flex': 1,
  'width': '100%',
  'white-space': 'pre-wrap',
  'overflow-y': 'auto',
  'overflow-x': 'hidden',
}

onMounted(async () => {
  const chartInstance = echarts.init(document.getElementById('chart'))
  c.mountChart(chartInstance)
  chartInstance.on('click', (params: any) => {
    const { data, seriesType, collapsed } = params
    if (!collapsed) {
      pkg.value = data.name
      pkgInfo.value = c.getRelation(data.name)
      pkgVersions.value = c.getVersions(data.name)
      pkgCirculated.value = c.circulatedPkg(data.name)
    }
    if (seriesType === 'graph')
      c.addGraph(data.name)
  })
})
</script>

<template>
  <div id="chart" />
  <div class="info">
    <input v-model="pkg" class="pkgSearch" placeholder="请输入查找的包名" type="text" @input="handlerSearch">
    <json-viewer
      :expand-depth="2"
      :value="pkgInfo ?? {}"
      copyable
      boxed
      expanded
      :style="jsonViewerStyle"
    />
  </div>
  <div class="versions">
    <div>
      <span class="pkgTitle">各个版本</span>
      <json-viewer
        :expand-depth="2"
        :value="pkgVersions ?? {}"
        copyable
        boxed
        expanded
        :style="jsonViewerStyle"
      />
    </div>
    <div>
      <span class="pkgTitle">循环引用</span>
      <json-viewer
        :expand-depth="2"
        :value="pkgCirculated ?? []"
        :show-array-index="false"
        copyable
        boxed
        expanded
        :style="jsonViewerStyle"
      />
    </div>
  </div>
</template>

<style scoped>
#chart {
  height: 100%;
  width: 80%;
  left: 10%;
}
.versions, .info {
  box-sizing: border-box;
  position: absolute;
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  right: 0;
  top: 0;
  width: 15%;
  height: 100vh;
}
.versions > div {
  box-sizing: border-box;
  flex: 1;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  overflow: hidden;
}
.info {
  width: 17%;
  left: 0;
}
.pkgSearch {
  box-sizing: border-box;
  display: block;
  outline-style: none ;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 12px 16px;
  font-size: 26px;
  width: 100%!important;
  overflow: hidden;
}
.pkgTitle {
  text-align: center;
  padding: 8px;
  font-weight: 700;
}
</style>
