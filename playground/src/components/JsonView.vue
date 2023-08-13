<script setup lang="ts">
defineProps(['data', 'depth'])
</script>

<template>
  <json-viewer
    :expand-depth="depth"
    :value="data ?? ''"
    copyable
    boxed
    expanded
  />
</template>
