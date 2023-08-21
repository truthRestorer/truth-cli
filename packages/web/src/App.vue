<script setup lang="ts">
import Chart from './components/Chart.vue'
</script>

<template>
  <Suspense>
    <div style="overflow: hidden;">
      <Chart />
    </div>
  </Suspense>
</template>
