<script setup lang="ts">
import type { Relation } from '@truth-cli/shared'

const { data } = defineProps<{
  data?: Relation | Partial<Relation>
}>()
</script>

<template>
  <div v-if="data">
    <div v-for="(value, key) in data" :key="key">
      <div v-if="key === 'devDependencies' || key === 'dependencies'">
        <div class="key">
          {{ key }}
        </div>
        <div v-for="(pkgVersion, pkgName) in value" :key="pkgName" class="pkg pl" style="padding-left: 16px;">
          <div style="line-height: 22px;">
            <span>- {{ pkgName }}</span>
            <span class="value">{{ pkgVersion }}</span>
          </div>
        </div>
      </div>
      <div v-else>
        <span class="key">{{ key }}</span>
        <a v-if="key === 'homepage'" :href="value" target="_blank" style="padding-left: 8px;color: var(--el-color-primary);">{{ value }}</a>
        <span v-else class="value">{{ value }}</span>
      </div>
    </div>
  </div>
  <div v-else class="notFound">
    没有找到该依赖的信息
  </div>
</template>

<style scoped>
.value {
  padding-left: 8px;
  color: #13ce66;
  line-height: 22px;
}
</style>
