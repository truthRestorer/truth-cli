<script setup lang="ts">
import { onMounted, provide, ref } from 'vue'
import type { Relations } from '@truth-cli/shared'
import type { PkgInfo } from '../types'
import echarts from '../plugins/echarts'
import { dealGraphNode, dealTreeNode, getPkgInfo, initChart } from '../utils/chart/index'
import { formatName } from '../utils/formatName'

const relationsJSON = await fetch('relations.json')
const relations: Relations = await relationsJSON.json()
const pkgName = ref(relations.__root__.name)
const pkgInfo = ref<PkgInfo>({ info: relations.__root__ })!
const isAim = ref(false)

provide('pkgName', pkgName)
provide('pkgInfo', pkgInfo)
provide('isAim', isAim)

onMounted(async () => {
  const chartDOM = echarts.init(document.getElementById('chart'))
  initChart(chartDOM, relations)
  chartDOM.on('click', (params: any) => {
    if (isAim.value)
      return
    const { data, seriesType, collapsed, treeAncestors } = params
    pkgName.value = formatName(data.name)
    pkgInfo.value = getPkgInfo(pkgName.value)
    if (seriesType === 'tree')
      dealTreeNode(data, collapsed, treeAncestors)
    else
      dealGraphNode(data.name)
  })
})
</script>

<template>
  <Container />
  <div id="chart" style="height:100vh" />
</template>
