<script setup lang="ts">
import treePkgs from '../assets/treePkgs.txt?raw'
</script>

<template>
  <div style="white-space:pre-wrap;" v-html="treePkgs" />
</template>
