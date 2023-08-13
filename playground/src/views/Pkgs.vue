<script setup lang="ts">
import JsonView from '../components/JsonView.vue'
import pkgs from '../assets/pkgs.json'
</script>

<template>
  <JsonView :data="pkgs" />
</template>

<style scoped></style>
