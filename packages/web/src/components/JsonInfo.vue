<script setup lang="ts">
import type { Relation } from '@truth-cli/shared'

const { data } = defineProps<{
  data?: Relation | Partial<Relation>
}>()
</script>

<template>
  <div v-if="data">
    <div v-for="(value, key) in data" :key="key" class="pl">
      <div v-if="key === 'devDependencies' || key === 'dependencies'">
        <div class="key">
          {{ key }}
        </div>
        <div v-for="(pkgVersion, pkgName) in value" :key="pkgName" class="pkg pl">
          <div style="line-height: 22px;">
            <span class="pl">- {{ pkgName }}</span>
            <span class="pr">:</span>
            <span class="value">{{ pkgVersion }}</span>
          </div>
        </div>
      </div>
      <div v-else>
        <span class="key">{{ key }}</span>
        <span class="pr">:</span>
        <a v-if="key === 'homepage'" :href="value" target="_blank">{{ value }}</a>
        <span v-else class="value">{{ value }}</span>
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
  letter-spacing: 0.5px;
}
.pr {
  padding-right: 6px;
}
.pl {
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
