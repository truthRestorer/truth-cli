<script setup lang="ts">
import relations from '../assets/relations.json'
</script>

<template>
  <JsonView :data="relations" :depth="2" />
</template>

<style scoped></style>
