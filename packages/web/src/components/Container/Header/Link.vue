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
  <Gituhub />
</template>
