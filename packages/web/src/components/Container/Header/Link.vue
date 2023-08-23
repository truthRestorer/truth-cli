<script setup lang="ts">
import { Moon, Sunny } from '@element-plus/icons-vue'
import { useDark } from '@vueuse/core'

const isDark = useDark()
</script>

<template>
  <ElSwitch
    v-model="isDark"
    :active-action-icon="Sunny"
    :inactive-action-icon="Moon"
    style="--el-switch-on-color:#434343"
    size="large"
  />
  <div class="link">
    <a target="_blank" href="https://truth-cli-playground.vercel.app/">演练场</a>
    <a target="_blank" href="https://truthrestorer.github.io/truth-cli/">中文文档</a>
  </div>
  <Gituhub />
</template>

<style scoped>
.link {
  display: flex;
  align-items: center;
  gap: 16px;
  min-width: max-content;
}
a {
  color: var(--el-text-color-primary);
  text-decoration: none;
  font-size: 14px;
  border-bottom: 2px solid transparent;
  transition: border-color 0.25s;
}
.link a:hover {
  border-color: #75dcff;
}
</style>
