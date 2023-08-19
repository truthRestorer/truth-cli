<script setup lang="ts">
import type { Relations } from '@truth-cli/shared'
import { provide, ref } from 'vue'
import Header from '../components/Header.vue'
import { Chart } from '../utils/index'
import type { PkgInfo } from '../types'
import Package from './Package.vue'

// 利用类似 relations 的结构生成 graph，你也可以直接将 relations 传入
const drawer = ref(true)
const relationsJSON = await fetch('relations.json')
const relations: Relations = await relationsJSON.json()
const pkgName = ref('__root__')
const pkgInfo = ref<PkgInfo>({ __info__: relations.__root__ })
const c = new Chart(relations)
provide('chartInstance', c)
provide('drawer', drawer)
provide('pkgName', pkgName)
provide('pkgInfo', pkgInfo)
</script>

<template>
  <div style="overflow: hidden;">
    <Header />
    <ElScrollbar always>
      <Package />
    </ElScrollbar>
  </div>
</template>
