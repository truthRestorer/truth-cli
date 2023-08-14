<script setup lang="ts">
import { shallowRef } from 'vue'
import Relations from './views/Relations.vue'
import Graph from './views/Graph.vue'
import Pkgs from './views/Pkgs.vue'
import Tree from './views/Tree.vue'
import Versions from './views/Versions.vue'
import TreePkgs from './views/TreePkgs.vue'

const selectComp = shallowRef(Relations)
</script>

<template>
  <div class="main">
    <div class="select">
      <Header />
      <span :class="{ active: selectComp === Relations }" @click="selectComp = Relations">genRelations</span>
      <span :class="{ active: selectComp === Graph }" @click="selectComp = Graph">genGraph</span>
      <span :class="{ active: selectComp === Tree }" @click="selectComp = Tree">genTree</span>
      <span :class="{ active: selectComp === Versions }" @click="selectComp = Versions">genVersions</span>
      <span :class="{ active: selectComp === Pkgs }" @click="selectComp = Pkgs">genPkgs</span>
      <span :class="{ active: selectComp === TreePkgs }" @click="selectComp = TreePkgs">genPkgTree</span>
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
  position: relative;
  margin-top: 60px;
}
.select {
  display: flex;
  position: fixed;
  z-index: 9999;
  background-color: #fff;
  width: 100%;
  box-shadow: 0 1px 4px #bbb;
}

.active {
  border-bottom: 3px solid #416574;
}

.select > span {
  padding: 10px 15px;
  cursor: pointer;
  font-weight: 700;
  transition: color .15s;
}
.select > span:hover {
  color: #aaa;
}
.jsonView {
  padding-top: 40px;
}
</style>
