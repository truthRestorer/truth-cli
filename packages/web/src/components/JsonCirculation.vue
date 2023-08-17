<script setup lang="ts">
const { data } = defineProps<{
  data?: string | string[]
}>()
</script>

<template>
  <div v-if="(typeof data === 'string')">
    <span>{{ data }}</span>
  </div>
  <div v-else-if="Array.isArray(data)">
    <div v-for="item in data" :key="item">
      <div>
        <span style="padding: 2px 6px;">-</span>
        <span>{{ item }}</span>
      </div>
    </div>
  </div>
  <JsonString v-else>
    该依赖不存在循环引用
  </JsonString>
</template>

<style scoped>
span {
  font-size: 14px;
}
</style>
