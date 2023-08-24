<script setup lang="ts">
import { onMounted, provide, ref } from 'vue'
import type { Relations } from '@truth-cli/shared'
import type { PkgInfo } from '../types'
import echarts from '../plugins/echarts'
import { addTreeNode, dealGraphNode, getPkgInfo, initChart, removeTreeNode } from '../utils/chart/index'
import { preDealName } from '../utils/preDealName'

const relationsJSON = await fetch('relations.json')
const relations: Relations = await relationsJSON.json()
const pkgName = ref(relations.__root__.name)
const pkgInfo = ref<PkgInfo>({ info: relations.__root__ })!
provide('pkgName', pkgName)
provide('pkgInfo', pkgInfo)

onMounted(async () => {
  const chartDOM = echarts.init(document.getElementById('chart'))
  initChart(chartDOM, relations)
  chartDOM.on('click', (params: any) => {
    const { data, seriesType, collapsed, treeAncestors } = params
    pkgName.value = preDealName(data.name)
    pkgInfo.value = getPkgInfo(pkgName.value)
    if (seriesType === 'tree') {
      if (collapsed)
        removeTreeNode(data)
      else
        addTreeNode(treeAncestors, data)
    }
    else {
      dealGraphNode(data.name)
    }
  })
})
</script>

<template>
  <Container />
  <div id="chart" style="padding-top: 50px;height:calc(100vh - 50px);" />
</template>
