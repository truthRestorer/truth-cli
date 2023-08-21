<script setup lang="ts">
import type { Relations } from '@truth-cli/shared'
import { provide, ref } from 'vue'
import { GraphChart, TreeChart } from '../utils/chart/index'
import type { PkgInfo } from '../types'
import Package from './Package.vue'

const relationsJSON = await fetch('relations.json')
const relations: Relations = await relationsJSON.json()
const pkgName = ref('__root__')
const pkgInfo = ref<PkgInfo>({ __info__: relations.__root__ })
const treeChart = new TreeChart(relations)
const graphChart = new GraphChart(relations)
provide('treeChart', treeChart)
provide('graphChart', graphChart)
provide('pkgName', pkgName)
provide('pkgInfo', pkgInfo)
</script>

<template>
  <div id="main" style="overflow: hidden;">
    <Header />
    <Package />
  </div>
</template>
