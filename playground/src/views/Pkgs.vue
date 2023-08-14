<script setup lang="ts">
import pkgs from '../assets/pkgs.json'
</script>

<template>
  <JsonView :data="pkgs" :depth="3" />
</template>

<style scoped></style>
