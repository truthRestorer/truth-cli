<script setup lang="ts">
import { provide, ref } from 'vue'

const drawer = ref(true)
provide('drawer', drawer)
</script>

<template>
  <Header />
  <Drawer />
</template>
