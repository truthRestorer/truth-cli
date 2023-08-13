<script setup lang="ts">
import JsonView from '../components/JsonView.vue'
import graph from '../assets/graph.json'
</script>

<template>
  <JsonView :data="graph" depth="3" />
</template>

<style scoped></style>
