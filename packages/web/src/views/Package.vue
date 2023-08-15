<script setup lang="ts">
import { inject, onMounted, onUnmounted } from 'vue'
import { ElDrawer, ElScrollbar } from 'element-plus'
import echarts from '../plugins/echarts'
import JsonView from '../components/JsonView.vue'

const graphSet = new Set()
const c = inject('chartInstance') as any
const pkgName = inject('pkgName') as any
const pkgInfo = inject('pkgInfo') as any
const drawer = inject('drawer') as any

onMounted(async () => {
  const chartInstance = echarts.init(document.getElementById('chart'))
  c.mountChart(chartInstance)
  chartInstance.on('click', (params: any) => {
    const { data, seriesType, collapsed } = params
    pkgName.value = data.name
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
  <div style="display:flex;height:100vh;padding-top:60px;box-sizing:border-box;">
    <div id="chart" style="flex: 1;" />
    <ElDrawer
      v-model="drawer"
      :modal="false"
      modal-class="modal"
      :title="pkgName"
      direction="ltr"
      size="20%"
    >
      <ElScrollbar always>
        <div class="f-wrap-column" style="padding:0 5px;">
          <JsonView :data="pkgInfo" />
        </div>
      </ElScrollbar>
    </ElDrawer>
  </div>
</template>

<style scoped>
.f-wrap-column {
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
}
</style>
