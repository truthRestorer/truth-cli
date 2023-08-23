<script setup lang="ts">
import { provide, ref } from 'vue'

const drawer = ref(false)
provide('drawer', drawer)
</script>

<template>
  <Header />
  <Drawer />
</template>
