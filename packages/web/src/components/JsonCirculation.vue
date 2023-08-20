<script setup lang="ts">
const { data } = defineProps<{
  data?: string[]
}>()
</script>

<template>
  <div v-if="data">
    <div v-for="item in data" :key="item">
      <div class="pkg">
        <span style="padding: 2px 6px;">-</span>
        <span>{{ item }}</span>
      </div>
    </div>
  </div>
  <JsonString v-else>
    该依赖不存在循环引用
  </JsonString>
</template>
