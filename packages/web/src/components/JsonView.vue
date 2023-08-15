<script setup lang="ts">
import VueJsonPretty from 'vue-json-pretty'
import 'vue-json-pretty/lib/styles.css'

defineProps(['data'])
</script>

<template>
  <VueJsonPretty
    :deep="2"
    :data="data"
    style="overflow: hidden;"
    :show-line="false"
    :show-double-quotes="false"
  />
</template>
