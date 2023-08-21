<script setup lang="ts">
import { onMounted, provide, ref } from 'vue'
import type { Relations } from '@truth-cli/shared'
import { useElementSize } from '@vueuse/core'
import echarts from '../plugins/echarts'
import { addGraphNode, addTreeNode, getPkgInfo, initChart, removeTreeNode } from '../utils/chart/index'
import { preDealName } from '../utils/preDealName'

const relationsJSON = await fetch('relations.json')
const relations: Relations = await relationsJSON.json()
const pkgName = ref('__root__')
const pkgInfo = ref<any>({ info: relations.__root__ })
const canvasRef = ref(null)
const { width, height } = useElementSize(canvasRef)
provide('pkgName', pkgName)
provide('pkgInfo', pkgInfo)
provide('width', width)
provide('height', height)

onMounted(async () => {
  const chartDOM = echarts.init(document.getElementById('chart'))
  initChart(chartDOM, relations)
  chartDOM.on('click', (params: any) => {
    const { data, seriesType, collapsed, treeAncestors } = params
    pkgName.value = preDealName(data.name)
    pkgInfo!.value = getPkgInfo(pkgName.value)
    if (seriesType === 'tree') {
      if (collapsed)
        removeTreeNode(data)
      else
        addTreeNode(treeAncestors, data)
    }
    else {
      addGraphNode(data.name)
    }
  })
})
</script>

<template>
  <ElScrollbar>
    <Toolbox />
    <Container />
    <div id="chart" ref="canvasRef" style="padding-top: 50px;height:calc(100vh - 60px);" />
  </ElScrollbar>
</template>
