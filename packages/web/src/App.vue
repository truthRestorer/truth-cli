<script setup lang="ts">
// import Graph from './components/Graph.vue'
import Tree from './components/Tree.vue'
</script>

<template>
  <Suspense>
    <div>
      <!-- <div style="height: 100vh">
        <Graph />
      </div> -->
      <div style="height: 100vh">
        <Tree />
      </div>
    </div>
  </Suspense>
</template>

<style scoped></style>
