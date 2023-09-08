<script setup lang="ts">
import type { Relation } from '@truth-cli/shared'

defineProps<{
  data: Relation
}>()
</script>

<template>
  <div v-for="(value, key) in data" :key="key">
    <div v-if="key === 'devDependencies' || key === 'dependencies'">
      <div class="key">
        {{ key }}
      </div>
      <div v-for="(version, name) in value" :key="name" class="pkg" style="padding-left: 16px;">
        <div style="line-height: 22px;">
          <span>- {{ name }}</span>
          <span class="value">{{ version }}</span>
        </div>
      </div>
    </div>
    <div v-else>
      <span class="key">{{ key }}</span>
      <a v-if="key === 'homepage' || key === 'path'" :href="String(value)" target="_blank" style="padding-left: 8px;">{{ value }}</a>
      <span v-else class="value">{{ value }}</span>
    </div>
  </div>
</template>
