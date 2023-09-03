<script setup lang="ts">
import type { ShowType } from 'packages/web/src/types'
import Circulation from './Circulation.vue'
import Extra from './Extra.vue'
import Info from './Info.vue'
import Versions from './Versions.vue'

defineProps<{
  data: any
  type: ShowType
}>()
</script>

<template>
  <Info v-if="type === 'info'" :data="data" />
  <Circulation v-else-if="type === 'circulation'" :data="data" />
  <Versions v-else-if="type === 'versions'" :data="data" />
  <Extra v-else-if="type === 'extra'" :data="data" />
</template>

<style scoped></style>
