<script setup lang="ts">
import versions from '../assets/versions.json'
</script>

<template>
  <JsonView :data="versions" :depth="2" />
</template>

<style scoped></style>
