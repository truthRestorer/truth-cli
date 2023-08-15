<script setup lang="ts">
import { provide, ref } from 'vue'
import Header from '../components/Header.vue'
import { Chart, initData } from '../utils/index'
import Package from './Package.vue'

const drawer = ref(false)
const { nodes, links, tree, relations, versions } = await initData()
const pkgName = ref('__root__')
const pkgInfo = ref(relations.__root__)
const c = new Chart(nodes, links, tree, relations, versions)
provide('chartInstance', c)
provide('drawer', drawer)
provide('pkgName', pkgName)
provide('pkgInfo', pkgInfo)
</script>

<template>
  <Header />
  <Package />
</template>
