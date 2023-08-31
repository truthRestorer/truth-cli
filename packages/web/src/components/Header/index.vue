<script setup lang="ts">
import { Aim, Search } from '@element-plus/icons-vue'
import { type Ref, inject, ref } from 'vue'
import type { Legend, PkgInfo } from '../../types'
import { changeGraphRoot, collapseNode, getPkgInfo, toggleChart } from '../../utils/'

const pkgName = inject<Ref<string>>('pkgName')!
const pkgInfo = inject<Ref<PkgInfo>>('pkgInfo')!
const drawer = inject<Ref<boolean>>('drawer')!
const isAim = inject<Ref<boolean>>('isAim')!
const legend = ref<Legend>('Graph')
let target = '__root__'

function handleGraphRoot() {
  if (legend.value !== 'Graph' || pkgName.value === '__root__')
    return
  if (!isAim.value)
    target = pkgName.value
  changeGraphRoot(target, isAim.value)
  isAim.value = !isAim.value
}

function debounce(fn: () => void) {
  let timer: NodeJS.Timeout | null = null
  return function () {
    if (timer)
      clearTimeout(timer)
    timer = setTimeout(() => {
      fn()
    }, 200)
  }
}

const handleSearch = debounce(() => {
  pkgInfo.value = getPkgInfo(pkgName.value)
})
</script>

<template>
  <div class="header">
    <div class="left">
      <img src="https://plumbiu.github.io/blogImg/weblogo.png" alt="Truth-cli">
    </div>
    <div class="right">
      <ElButton v-if="legend === 'Graph'" :icon="Aim" title="命中/还原节点" @click="handleGraphRoot" />
      <ElInput v-model="pkgName" placeholder="搜索依赖" @input="handleSearch">
        <template #suffix>
          <ElIcon>
            <Search />
          </ElIcon>
        </template>
      </ElInput>
      <ElButton @click="() => collapseNode(legend)">
        收缩节点
      </ElButton>
      <ElButton @click="drawer = !drawer">
        {{ drawer ? '关闭' : '打开' }}信息框
      </ElButton>
      <ElButton @click="() => legend = toggleChart(legend)">
        切换图表
      </ElButton>
      <Link />
    </div>
  </div>
</template>

<style scoped>
.header {
  position: fixed;
  left: 0;
  right: 0;
  z-index: 999;
  display: flex;
  justify-content: space-between;
  background-color: var(--el-bg-color);
  padding: 0px 16px;
  height: 50px;
  box-shadow: var(--el-box-shadow-light);
  transition: background-color 0.4s !important;
}
.right, .left {
  display: flex;
  align-items: center;
  gap: 16px;
}
</style>