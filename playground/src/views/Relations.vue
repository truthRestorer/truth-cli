<script setup lang="ts">
import JsonView from '../components/JsonView.vue'
import relations from '../assets/relations.json'
</script>

<template>
  <JsonView :data="relations" :depth="2" />
</template>
