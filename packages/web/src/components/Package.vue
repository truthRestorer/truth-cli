<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { Search } from '@element-plus/icons-vue'
import echarts from '../plugins/echarts'
import { Chart, debounce, initData } from '../utils/index'

const graphSet = new Set()
const { nodes, links, tree, relations, versions } = await initData()
const pkgName = ref()
const lengend = ref<'Tree' | 'Force'>('Tree')
const pkgInfo = ref(relations.__root__)
const c = new Chart(nodes, links, tree, relations, versions)
const handleSearch = debounce(() => {
  const searchResult = c.getPkgInfo(pkgName.value)
  if (searchResult)
    pkgInfo.value = searchResult
})

onMounted(async () => {
  const chartInstance = echarts.init(document.getElementById('chart'))
  c.mountChart(chartInstance)
  chartInstance.on('click', (params: any) => {
    const { data, seriesType, collapsed } = params
    if (!collapsed || !data.children)
      pkgInfo.value = c.getPkgInfo(data.name)
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
  <div class="header">
    <div class="left">
      <div class="logo">
        LOGO
      </div>
    </div>
    <div class="right">
      <ElInput v-model="pkgName" placeholder="搜索依赖" @input="handleSearch">
        <template #suffix>
          <ElIcon>
            <Search />
          </ElIcon>
        </template>
      </ElInput>
      <ElButton @click="lengend = c.toggleLegend(lengend)">
        切换实例
      </ElButton>
      <div class="link">
        <a target="_blank" href="https://truth-cli-playground.vercel.app/">演练场</a>
        <a target="_blank" href="https://truthrestorer.github.io/truth-cli/">中文文档</a>
      </div>
      <Github />
    </div>
  </div>
  <div style="display:flex;height: 100vh;padding-top: 60px;box-sizing: border-box;">
    <div id="chart" style="flex: 1;" />
    <ElScrollbar always>
      <div class="f-wrap-column" style="width: max-content;min-width: 350px;max-width:400px;padding: 0 5px;">
        <JsonView :data="pkgInfo" />
      </div>
    </ElScrollbar>
  </div>
</template>

<style scoped>
.f-wrap-column {
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
}
.header {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  background-color: #fefefe;
  display: flex;
  justify-content: space-between;
  padding: 8px 40px;
  max-height: 60px;
  box-shadow: 0 1px 12px #efefef;
  z-index: 9999;
}
.right, .left, .link {
  display: flex;
  align-items: center;
  gap: 25px;
}
.link {
  gap: 10px;
  min-width: max-content;
}
.link a {
  color: #434343;
  font-size: 14px;
  text-decoration: none;
  border-bottom: 2px solid transparent;
  transition: all 0.35s;
}
.link a:hover {
  border-color: #26a3eb;
  color: #000;
}
</style>
