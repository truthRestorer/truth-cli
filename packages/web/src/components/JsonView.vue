<script setup lang="ts">
import type { CSSProperties } from 'vue'
import { ref } from 'vue'
import VueJsonPretty from 'vue-json-pretty'
import 'vue-json-pretty/lib/styles.css'

defineProps(['data'])

const selectedValue = ref('')
const style: CSSProperties = {
  overflow: 'hidden',
}
</script>

<template>
  <VueJsonPretty
    :deep="2"
    :data="data"
    :style="style"
    :show-line="false"
    :show-double-quotes="false"
    :selected-value="selectedValue"
    show-line-number
  />
</template>
