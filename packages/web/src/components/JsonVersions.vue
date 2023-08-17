<script setup lang="ts">
const { data } = defineProps<{
  data?: {
    [key: string]: string[] | string
  }
}>()
</script>

<template>
  <div v-if="data">
    <div v-for="(item, key) in data" :key="key">
      <div v-if="Array.isArray(item)">
        <span size="large" class="key">{{ key }}</span>
        <div v-for="version in item" :key="version" class="item pkg">
          <span>- </span>
          <span>{{ version }}</span>
        </div>
      </div>
      <div v-else>
        <span class="key">{{ key }}</span>
        <div class="item pkg">
          <span>- </span>
          {{ item }}
        </div>
      </div>
    </div>
  </div>
  <JsonString v-else>
    该依赖不存在多个版本
  </JsonString>
</template>

<style scoped>
.key {
  font-weight: 700;
  padding: 5px;
}
.item {
  padding-left: 24px;
}
</style>
