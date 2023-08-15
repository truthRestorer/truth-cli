<script setup lang="ts">
import JsonView from '../components/JsonView.vue'
import tree from '../assets/tree.json'
</script>

<template>
  <JsonView :data="tree" :depth="3" />
</template>
