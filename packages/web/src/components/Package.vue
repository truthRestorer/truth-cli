<!-- eslint-disable no-console -->
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import echarts from '../plugins/echarts'
import { Chart, initData } from '../utils/index'

const pkg = ref('')
const pkgDescription = ref('')
const pkgVersions = ref()
const pkgCirculated = ref()

const { nodes, links, tree, relations, versions } = await initData()
const c = new Chart(nodes, links, tree, relations, versions)

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
    <input type="text">
    <json-viewer
      v-if="pkgDescription"
      :expand-depth="2"
      :value="pkgDescription"
      copyable
      boxed
      expanded
      style="height: 90vh;overflow: scroll;overflow-x: hidden;"
    />
  </div>
  <div v-if="pkgVersions" class="versions">
    <json-viewer
      :expand-depth="2"
      :value="pkgVersions"
      :show-array-index="false"
      copyable
      boxed
      expanded
      style="height: 90vh;overflow: scroll;overflow-x: hidden;"
    />
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
}
.info {
  left: 0;
  width: 20%;
}
.pkgName {
  color: rgba(128, 38, 247, 0.644);
  font-size: 24px;
  font-weight: 700;
}
</style>
