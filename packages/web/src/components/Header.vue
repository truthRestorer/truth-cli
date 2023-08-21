<script setup lang="ts">
import { Moon, Search, Sunny } from '@element-plus/icons-vue'
import { type Ref, inject, ref } from 'vue'
import { useDark } from '@vueuse/core'
import { type GraphChart, type TreeChart } from '../utils/chart/index'
import { debounce } from '../utils/debounce'
import type { Legend, PkgInfo } from '../types'
import { getPkgInfo } from '../utils/chart/tools'

const legend = ref<Legend>('Graph')
const pkgName = inject<Ref<string>>('pkgName')!
const pkgInfo = inject<Ref<PkgInfo>>('pkgInfo')!
const treeChart = inject<TreeChart>('treeChart')!
const graphChart = inject<GraphChart>('graphChart')!
const activeName = ref('info')
const drawer = ref(true)
const checked = ref(true)

function handleTagChange() {
  if (pkgName.value === '__root__') {
    ElMessage('请查看项目根目录的 package.json')
    return
  }
  window.open(`https://npmjs.com/package/${pkgName.value}`)
}
function toggleLegend() {
  if (legend.value === 'Tree')
    legend.value = graphChart.renderChart()
  else
    legend.value = treeChart.renderChart()
}

const handleSearch = debounce(() => {
  pkgInfo.value = getPkgInfo(pkgName.value, treeChart.relations)
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
  <ElDrawer
    v-model="drawer"
    :modal="false"
    modal-class="modal"
    :title="pkgName"
    direction="ltr"
    size="22%"
    style="--el-drawer-padding-primary:16px;position:fixed;z-index: 9999;"
  >
    <template #header>
      <ElCheckTag :checked="checked" style="flex:none;" @change="handleTagChange">
        NPM
      </ElCheckTag>
      <div style="flex: 1;font-weight: 700;font-size: 20px;color: var(--el-text-color-primary);">
        {{ pkgName }}
      </div>
    </template>
    <ElScrollbar always style="font-size: 14px;color: var(--el-text-color-primary);line-height: 26px;">
      <ElTabs v-model="activeName">
        <ElTabPane label="依赖信息" name="info">
          <JsonInfo :data="pkgInfo?.__info__" />
        </ElTabPane>
        <ElTabPane label="循环依赖" name="circulation">
          <JsonCirculation :data="pkgInfo?.__circulation__" />
        </ElTabPane>
        <ElTabPane label="多版本" name="versions">
          <JsonVersions :data="pkgInfo?.__versions__ " />
        </ElTabPane>
      </ElTabs>
    </ElScrollbar>
  </ElDrawer>
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
