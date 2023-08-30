<script setup lang="ts">
import type { Relation } from '@truth-cli/shared'

const { data } = defineProps<{
  data?: Relation | string[] | { [key: string]: string[] }
  type: string
}>()

const showMap: any = {
  info: '依赖信息',
  circulation: '循环依赖',
  versions: '版本信息',
}
</script>

<template>
  <div v-if="data">
    <div v-for="(value, key) in data" :key="key">
      <div v-if="key === 'devDependencies' || key === 'dependencies'">
        <div class="key">
          {{ key }}
        </div>
        <div v-for="(pkgVersion, pkgName) in value" :key="pkgName" class="pkg" style="padding-left: 16px;">
          <div style="line-height: 22px;">
            <span>- {{ pkgName }}</span>
            <span class="value">{{ pkgVersion }}</span>
          </div>
        </div>
      </div>
      <div v-else-if="Array.isArray(value)">
        <div v-for="(item, subKey) in data" :key="subKey">
          <span class="key">
            {{ subKey }}
          </span>
          <div v-for="version in item" :key="String(version)" class="value pkg" style="padding-left: 16px;">
            - {{ version }}
          </div>
        </div>
      </div>
      <div v-else>
        <span class="key">{{ key }}</span>
        <a v-if="key === 'homepage'" :href="String(value)" target="_blank" style="padding-left: 8px;">{{ value }}</a>
        <span v-else class="value">{{ value }}</span>
      </div>
    </div>
  </div>
  <div v-else class="value">
    未找到{{ showMap[type] }}
  </div>
</template>

<style scoped>
.pkg {
  cursor: pointer;
  transition: background-color .05s;
}
.pkg:hover {
  background-color: var(--el-color-primary-light-9);
}
.key {
  font-weight: 700;
}
.value {
  padding-left: 8px;
  color: var(--el-color-success-dark-2);
  line-height: 22px;
}
</style>
