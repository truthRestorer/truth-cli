<script setup lang="ts">
import { onMounted, provide, ref } from 'vue'
import type { Relations } from '@truth-cli/shared'
import type { PkgInfo } from '../../types'
import echarts from '../../plugins/echarts'
import { dealGraphNode, dealTreeNode, formatName, getPkgInfo, initChart } from '../../utils/index'

const base: Relations = await fetch('base.json').then(data => data.json())
const pkgName = ref(base.__root__.name)
const pkgInfo = ref<PkgInfo>({ info: base.__root__ })
const isAim = ref(false)
const drawer = ref(false)

provide('drawer', drawer)
provide('pkgName', pkgName)
provide('pkgInfo', pkgInfo)
provide('isAim', isAim)

onMounted(async () => {
  const chartDOM = echarts.init(document.getElementById('chart'))
  initChart(chartDOM, base)
  chartDOM.on('click', (params: any) => {
    const { data, seriesType, collapsed, treeAncestors } = params
    pkgName.value = formatName(data.name)
    pkgInfo.value = getPkgInfo(pkgName.value)
    if (seriesType === 'tree')
      dealTreeNode(data, collapsed, treeAncestors)
    else if (!isAim.value)
      dealGraphNode(data.name)
  })
})
</script>

<template>
  <Header />
  <Drawer />
  <div id="chart" style="height:100vh" />
</template>
