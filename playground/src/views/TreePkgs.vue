<script setup lang="ts">
import JsonView from '../components/JsonView.vue'
import treePkgs from '../assets/treePkgs.txt?raw'
</script>

<template>
  <JsonView :data="treePkgs" depth="3" />
</template>

<style scoped></style>
