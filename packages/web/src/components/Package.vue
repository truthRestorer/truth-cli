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

// TODO: 显示同个包不同版本，做法：通过 relations.json 做到
// TODO: 希望左边有个能显示对象的方框，用户输入包名可查找相应信息
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
  <div id="chart" style="height: 100%;width: 80%;" />
  <div class="pkgShow">
    <div class="pkgName">
      {{ pkg }}
    </div>
    <div v-if="pkgDescription">
      <div>详细信息</div>
      <json-viewer
        :value="pkgDescription"
        copyable
        boxed
      />
    </div>
    <div v-if="pkgVersions">
      <div>多个版本实例</div>
      <json-viewer
        :value="pkgVersions"
        :show-array-index="false"
        copyable
        boxed
      />
    </div>
  </div>
</template>

<style scoped>
.pkgShow {
  position: absolute;
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  right: 0;
  top: 0;
  width: 20%;
  overflow: auto;
}
.pkgName {
  color: rgba(128, 38, 247, 0.644);
  font-size: 24px;
  font-weight: 700;
}
</style>
