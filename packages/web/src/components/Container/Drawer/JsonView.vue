<script setup lang="ts">
defineProps(['showInfo', 'pkgInfo'])
</script>

<template>
  <ElScrollbar style="font-size:14px;color:var(--el-text-color-primary);line-height:26px;">
    <JsonInfo v-if="showInfo === 'info'" :data="pkgInfo?.info" />
    <JsonCirculation v-else-if="showInfo === 'circulation'" :data="pkgInfo?.circulation" />
    <JsonVersions v-else :data="pkgInfo?.versions" />
  </ElScrollbar>
</template>
