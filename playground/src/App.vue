<script setup lang="ts">
import { ref } from 'vue'
import VueJsonPretty from 'vue-json-pretty'
import 'vue-json-pretty/lib/styles.css'
import { genCirculation, genGraph, genTree, genVersions } from '@truth-cli/core'
import txt from './assets/pkgs.txt?raw'
import relations from './assets/relations.json'
import json from './assets/pkgs.json'

const data = ref<any>(relations)
const active = ref('relations')
const graph = genGraph(relations.__root__ as any)
const versions = genVersions(relations as any)
const tree = genTree(2, relations as any)
const circulation = genCirculation(relations as any)

function toggleLgend(val: any, type: string) {
  data.value = val
  active.value = type
}
</script>

<template>
  <div class="main">
    <div class="select">
      <Header />
      <span :class="{ active: active === 'relations' }" @click="toggleLgend(relations, 'relations')">genRelations</span>
      <span :class="{ active: active === 'graph' }" @click="toggleLgend(graph, 'graph')">genGraph</span>
      <span :class="{ active: active === 'tree' }" @click="toggleLgend(tree, 'tree')">genTree</span>
      <span :class="{ active: active === 'versions' }" @click="toggleLgend(versions, 'versions')">genVersions</span>
      <span :class="{ active: active === 'circulation' }"
        @click="toggleLgend(circulation, 'circulation')">genCirculation</span>
      <span :class="{ active: active === 'pkgs' }" @click="toggleLgend(json, 'pkgs')">genJson</span>
      <span :class="{ active: active === 'treePkgs' }" @click="toggleLgend(txt, 'treePkgs')">genTxt</span>
    </div>
    <div style="padding-top: 55px;">
      <VueJsonPretty v-if="data !== txt" :deep="2" :data="data" :show-line="false" :show-double-quotes="false"
        :height="800" show-line-number virtual />
      <div v-else style="white-space: pre;">
        {{ txt }}
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
