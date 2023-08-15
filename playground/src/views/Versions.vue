<script setup lang="ts">
import JsonView from '../components/JsonView.vue'
import versions from '../assets/versions.json'
</script>

<template>
  <JsonView :data="versions" :depth="2" />
</template>
