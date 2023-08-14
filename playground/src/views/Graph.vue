<script setup lang="ts">
import graph from '../assets/graph.json'
</script>

<template>
  <JsonView :data="graph" :depth="2" />
</template>

<style scoped></style>
