<script setup lang="ts">
defineProps<{
  data: string[]
}>()
</script>

<template>
  <div v-for="(item, subKey) in data" :key="subKey" style="line-height: 22px;">
    <span class="key">
      {{ subKey }}
    </span>
    <span class="value">
      {{ item }}
    </span>
  </div>
</template>
