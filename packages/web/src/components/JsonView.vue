<script setup lang="ts">
import type { CSSProperties } from 'vue'

defineProps(['data'])
const style: CSSProperties = {
  'flex': 1,
  'width': '100%',
  'white-space': 'pre-wrap',
  'overflow-y': 'auto',
  'overflow-x': 'hidden',
}
</script>

<template>
  <json-viewer
    :expand-depth="2"
    :value="data"
    :style="style"
    copyable
    expanded
  />
</template>
