<script setup lang="ts">
defineProps<{
  data: Record<string, string[]>
}>()
</script>

<template>
  <div v-for="(value, key) in data" :key="key">
    <div class="key">
      {{ key }}
    </div>
    <div v-for="version in value" :key="version" class="pkg" style="padding-left: 16px;">
      <div style="line-height: 22px;">
        <span>-</span>
        <span class="value">{{ version }}</span>
      </div>
    </div>
  </div>
</template>
