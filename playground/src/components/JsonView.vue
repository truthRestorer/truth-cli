<script setup lang="ts">
import VueJsonPretty from 'vue-json-pretty'
import 'vue-json-pretty/lib/styles.css'

defineProps(['data', 'depth'])
</script>

<template>
  <VueJsonPretty
    :deep="depth"
    :data="data"
    :show-line="false"
    :show-double-quotes="false"
    :height="800"
    show-line-number
    virtual
  />
</template>
