<script setup lang="ts">
import { ref } from 'vue'
import { genGraph, genTree, genVersions } from '@truth-cli/core'
import treePkgs from './assets/pkgs.txt?raw'
import relations from './assets/relations.json'
import pkgs from './assets/pkgs.json'

const data = ref<any>(relations)
const graph = genGraph(relations.__root__ as any)
const versions = genVersions(relations as any)
const tree = genTree(3, relations as any)
</script>

<template>
  <div class="main">
    <div class="select">
      <Header />
      <span :class="{ active: data === relations }" @click="data = relations">genRelations</span>
      <span :class="{ active: data === graph }" @click="data = graph">genGraph</span>
      <span :class="{ active: data === tree }" @click="data = tree">genTree</span>
      <span :class="{ active: data === versions }" @click="data = versions">genVersions</span>
      <span :class="{ active: data === pkgs }" @click="data = pkgs">genJson</span>
      <span :class="{ active: data === treePkgs }" @click="data = treePkgs">genTxt</span>
    </div>
    <div style="padding-top: 55px;">
      <JsonView v-if="data !== treePkgs" :data="data" :depth="2" />
      <div v-else style="white-space: pre;">
        {{ treePkgs }}
      </div>
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
