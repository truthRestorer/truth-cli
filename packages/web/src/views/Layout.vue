<script setup lang="ts">
import { provide, ref } from 'vue'
import Header from '../components/Header.vue'
import { Chart } from '../utils/index'
import Package from './Package.vue'

// 利用类似 relations 的结构生成 graph，你也可以直接将 relations 传入
const drawer = ref(false)
const relationsJSON = await fetch('relations.json')
const relations = await relationsJSON.json()
const pkgName = ref('__root__')
const pkgInfo = ref(relations.__root__)
const c = new Chart(relations)
provide('chartInstance', c)
provide('drawer', drawer)
provide('pkgName', pkgName)
provide('pkgInfo', pkgInfo)
</script>

<template>
  <Header />
  <Package />
</template>
