<script setup lang="ts">
import { inject, onMounted, ref } from 'vue'
import type { Relations } from '@truth-cli/shared'
import type { Ref } from 'vue'
import echarts from '../plugins/echarts'
import type { PkgInfo } from '../types'
import type { GraphChart, TreeChart } from '../utils/chart/index'
import { initChart } from '../utils/chart/index'
import { getPkgInfo } from '../utils/chart/tools'
import { preDealName } from '../utils/preDealName'

const graphSet = new Set()
const relations = inject<Relations>('relations')!
const treeChart = inject<TreeChart>('treeChart')!
const graphChart = inject<GraphChart>('graphChart')!
const pkgName = inject<Ref<string>>('pkgName')!
const pkgInfo = inject<Ref<PkgInfo> >('pkgInfo')
const drawer = inject<Ref<boolean>>('drawer')
const activeName = ref('info')
const checked = ref(true)

function handleTagChange() {
  if (pkgName.value === '__root__') {
    ElMessage('请查看项目根目录的 package.json')
    return
  }
  window.open(`https://npmjs.com/package/${pkgName.value}`)
}

onMounted(async () => {
  const chartInstance = echarts.init(document.getElementById('chart'))
  initChart(chartInstance, relations)
  chartInstance.on('click', (params: any) => {
    const { data, seriesType, collapsed, treeAncestors } = params
    pkgName.value = preDealName(data.name)
    pkgInfo!.value = getPkgInfo(pkgName.value, relations)
    if (seriesType === 'tree') {
      if (collapsed)
        treeChart.removeTreeNode(data)
      else
        treeChart.addTreeNode(treeAncestors, data)
    }
    else if (seriesType === 'graph' && !graphSet.has(pkgName.value)) {
      graphSet.add(pkgName.value)
      graphChart.addGraph(pkgName.value)
    }
  })
})
</script>

<template>
  <ElScrollbar :always="false">
    <div style="margin-top:60px;box-sizing:border-box;">
      <div id="chart" style="height:calc(100vh - 60px);" />
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
    </div>
  </ElScrollbar>
</template>

<style scoped>
.f-wrap-column {
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
}
.tag {
  margin-right:8px;
}
</style>
