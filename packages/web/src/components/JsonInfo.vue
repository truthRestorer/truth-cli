<script setup lang="ts">
import type { Relation } from '@truth-cli/shared'

const { data } = defineProps<{
  data?: Relation | Partial<Relation>
}>()
</script>

<template>
  <div v-if="data">
    <div v-for="(value, key) in data" :key="key" class="tab">
      <div v-if="key === 'version'">
        <span class="key">{{ key }}</span>
        <span class="slug">:</span>
        <span class="value">{{ value }}</span>
      </div>
      <div v-else-if="key === 'homepage'">
        <span class="key">{{ key }}</span>
        <span class="slug">:</span>
        <a target="_blank" :href="value">{{ value }}</a>
      </div>
      <div v-else-if="key === 'devDependencies' || key === 'dependencies'">
        <div>
          <span class="key">{{ key }}</span>
        </div>
        <div v-for="(dep, depKey) in value" :key="dep" class="pkg tab">
          <div style="line-height: 22px;">
            <span class="tab">- {{ depKey }}</span>
            <span class="slug">:</span>
            <span class="value">{{ dep }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
  <JsonString v-else>
    "没有找到该依赖的信息"
  </JsonString>
</template>

<style scoped>
a {
  color: var(--el-color-primary);
  text-decoration: none;
  letter-spacing: 0.5px;
}
div {
  overflow: hidden;
}
.slug {
  padding-right: 6px;
}
.tab {
  padding-left: 8px;
}
.key {
  font-weight: 700;
}
.value {
  letter-spacing: 1px;
  color: #13ce66;
  line-height: 22px;
}
</style>
