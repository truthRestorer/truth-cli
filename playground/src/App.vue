<script setup lang="ts">
import { ref } from 'vue'
import Relations from './views/Relations.vue'
import Header from './components/Header.vue'
import Graph from './views/Graph.vue'
import Pkgs from './views/Pkgs.vue'
import Tree from './views/Tree.vue'
import Versions from './views/Versions.vue'

const selectComp = ref(Relations)
</script>

<template>
  <Header />
  <div class="main">
    <div class="select">
      <button @click="selectComp = Graph">
        Graph
      </button>
      <button @click="selectComp = Pkgs">
        Pkgs
      </button>
      <button @click="selectComp = Relations">
        Relations
      </button>
      <button @click="selectComp = Tree">
        Tree
      </button>
      <button @click="selectComp = Versions">
        Versions
      </button>
    </div>
    <div class="jsonView">
      <KeepAlive>
        <component :is="selectComp" />
      </KeepAlive>
    </div>
  </div>
</template>

<style scoped>
.main {
  margin-top: 60px;
  display: flex;
}
.main > div {
  flex: 1;
}
</style>
