<script setup lang="ts">
import Package from './components/Package.vue'
</script>

<template>
  <Suspense>
    <div style="height: 100vh;">
      <Package />
    </div>
  </Suspense>
</template>
