<script setup lang="ts">
import { shallowRef } from 'vue'
import Relations from './views/Relations.vue'
import Graph from './views/Graph.vue'
import Pkgs from './views/Pkgs.vue'
import Tree from './views/Tree.vue'
import Versions from './views/Versions.vue'
import TreePkgs from './views/TreePkgs.vue'
import Header from './components/Header.vue'

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
    <div style="padding-top: 55px;">
      <KeepAlive>
        <component :is="selectComp" />
      </KeepAlive>
    </div>
  </div>
</template>

<style scoped>
.main {
  margin-top: 60px;
}
.select {
  display: flex;
  position: fixed;
  z-index: 9999;
  background-color: #fff;
  width: 100%;
  box-shadow: 0 1px 4px #bbb;
  & span {
    padding: 10px 15px;
    cursor: pointer;
    font-weight: 700;
    transition: color .15s;
  }
  & span:hover {
    color: #aaa;
  }
}
.active {
  border-bottom: 3px solid #416574;
}
</style>
