<script setup lang="ts">
import { inject, onMounted } from 'vue'
import type { Ref } from 'vue'
import echarts from '../plugins/echarts'
import type { PkgInfo } from '../types'
import type { GraphChart, TreeChart } from '../utils/chart/index'
import { initChart } from '../utils/chart/index'
import { getPkgInfo } from '../utils/chart/tools'
import { preDealName } from '../utils/preDealName'

const treeChart = inject<TreeChart>('treeChart')!
const graphChart = inject<GraphChart>('graphChart')!
const pkgName = inject<Ref<string>>('pkgName')!
const pkgInfo = inject<Ref<PkgInfo> >('pkgInfo')

onMounted(async () => {
  const relations = treeChart.relations
  const chartDOM = echarts.init(document.getElementById('chart'))
  initChart(chartDOM, relations)
  chartDOM.on('click', (params: any) => {
    const { data, seriesType, collapsed, treeAncestors } = params
    pkgName.value = preDealName(data.name)
    pkgInfo!.value = getPkgInfo(pkgName.value, relations)
    if (seriesType === 'tree') {
      if (collapsed)
        treeChart.removeTreeNode(data)
      else
        treeChart.addTreeNode(treeAncestors, data)
    }
    else {
      graphChart.addGraph(data.name)
    }
  })
})
</script>

<template>
  <ElScrollbar :always="false">
    <div style="margin-top:60px;box-sizing:border-box;">
      <div id="chart" style="height:calc(100vh - 60px);" />
    </div>
  </ElScrollbar>
</template>

<style scoped>
.f-wrap-column {
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
}
.tag {
  margin-right:8px;
}
</style>
