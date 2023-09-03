<script setup lang="ts">
import type { Relation } from '@truth-cli/shared'

defineProps<{
  data: Relation[]
}>()
</script>

<template>
  <div v-for="value in data" :key="value.version">
    <div class="key" style="text-align: center;">
      v{{ value.version }}
    </div>
    <Info :data="value" />
  </div>
</template>
