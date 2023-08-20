<script setup lang="ts">
import { Moon, Search, Sunny } from '@element-plus/icons-vue'
import type { Ref } from 'vue'
import { inject, ref } from 'vue'
import { useDark } from '@vueuse/core'
import type { GraphChart, TreeChart } from '../utils/chart/index'
import { debounce } from '../utils/debounce'
import type { Legend, PkgInfo } from '../types'
import { getPkgInfo } from '../utils/chart/tools'
import Github from './Github.vue'

const legend = ref<Legend>('Graph')
const drawer = inject<boolean>('drawer')
const pkgName = inject<Ref<string>>('pkgName')!
const pkgInfo = inject<Ref<PkgInfo>>('pkgInfo')!
const treeChart = inject<TreeChart>('treeChart')!
const graphChart = inject<GraphChart>('graphChart')!

function toggleLegend() {
  if (legend.value === 'Tree')
    legend.value = graphChart.renderChart()
  else
    legend.value = treeChart.renderChart()
}

const handleSearch = debounce(() => {
  const searchResult = getPkgInfo(pkgName.value, treeChart.relations)
  if (searchResult)
    pkgInfo.value = searchResult
})

function handleCollapse() {
  if (legend.value === 'Tree')
    treeChart.collapseTreeNode()
  else
    graphChart.collapseGraphNode()
}

const isDark = useDark()
</script>

<template>
  <div class="header">
    <div class="left">
      <div class="logo">
        Truth-cli
      </div>
    </div>
    <div class="right">
      <ElInput v-model="pkgName" style="max-width: 300px;" placeholder="搜索依赖" @input="handleSearch">
        <template #suffix>
          <ElIcon>
            <Search />
          </ElIcon>
        </template>
      </ElInput>
      <ElButton @click="handleCollapse">
        折叠节点
      </ElButton>
      <ElButton @click="drawer = !drawer">
        {{ drawer ? '关闭' : '打开' }}信息框
      </ElButton>
      <ElButton @click="toggleLegend">
        切换图表
      </ElButton>
      <ElSwitch
        v-model="isDark"
        :active-action-icon="Sunny"
        :inactive-action-icon="Moon"
        style="--el-switch-on-color:#434343"
        size="large"
      />
      <div class="link">
        <a target="_blank" href="https://truth-cli-playground.vercel.app/">演练场</a>
        <a target="_blank" href="https://truthrestorer.github.io/truth-cli/">中文文档</a>
      </div>
      <Github />
    </div>
  </div>
</template>

<style scoped>
.header {
  position: fixed;
  z-index: 999;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  background-color: var(--el-bg-color);
  padding: 8px 15px;
  max-height: 60px;
  box-shadow: 0 1px 4px rgba(100, 100, 100, .3);
  transition: background-color .4s!important;
  & .right, .left, .link{
    display: flex;
    align-items: center;
    gap: 16px;
  }
  & .right {
    flex: 3;
    justify-content: flex-end;
  }
  & .left {
    flex: 1;
    margin-left: 22%;
    & .logo {
      font-size: 24px;
      font-weight: 500;
      letter-spacing: 4px;
    }
  }
}
a {
  font-size: 14px;
  border-bottom: 2px solid transparent;
  transition: border-color 0.25s;
}
a:hover {
  border-color: #75dcff;
}
</style>
