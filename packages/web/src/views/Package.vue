<script setup lang="ts">
import { inject, onMounted, onUnmounted, ref } from 'vue'
import { ElCheckTag, ElDrawer, ElMessage, ElScrollbar, ElTabPane, ElTabs } from 'element-plus'
import echarts from '../plugins/echarts'
import JsonView from '../components/JsonView.vue'

const graphSet = new Set()
const c = inject('chartInstance') as any
const pkgName = inject('pkgName') as any
const pkgInfo = inject('pkgInfo') as any
const drawer = inject('drawer') as any
const activeName = ref('info')
const checked = ref(true)

function handleTagChange() {
  const homepage = pkgInfo.value?.__info__?.homepage
  if (homepage)
    window.open(homepage)
  else
    ElMessage('此依赖不含首页信息')
}

onMounted(async () => {
  const chartInstance = echarts.init(document.getElementById('chart'))
  c.mountChart(chartInstance)
  chartInstance.on('click', (params: any) => {
    const { data, seriesType, collapsed, treeAncestors } = params
    pkgName.value = data.name
    if (!collapsed) {
      pkgInfo.value = c.getPkgInfo(data.name)
      c.addTreeNode(treeAncestors, data)
    }
    if (seriesType === 'graph' && !graphSet.has(data.name)) {
      graphSet.add(data.name)
      c.addGraph(data.name)
    }
  })
})
onUnmounted(() => {
  c.echart?.off('click')
  c.echart?.off('legendselectchanged')
  c.echart?.dispose()
})
</script>

<template>
  <div style="display:flex;height:100vh;padding-top:60px;box-sizing:border-box;">
    <div id="chart" style="flex:1;" />
    <ElDrawer
      v-model="drawer"
      :modal="false"
      modal-class="modal"
      :title="pkgName"
      direction="ltr"
      size="22%"
      style="--el-drawer-padding-primary:16px"
    >
      <template #header>
        <ElCheckTag :checked="checked" style="flex:none;" @change="handleTagChange">
          INFO
        </ElCheckTag>
        <div style="flex: 1;font-weight: 700;font-size: 20px;color: var(--el-text-color-primary);">
          {{ pkgName }}
        </div>
      </template>
      <ElScrollbar always>
        <ElTabs v-model="activeName">
          <ElTabPane label="依赖信息" name="info">
            <div class="f-wrap-column" style="padding:0 5px;">
              <JsonView :data="pkgInfo.__info__ ?? '没有找到该依赖的信息'" />
            </div>
          </ElTabPane>
          <ElTabPane label="循环依赖" name="circulation">
            <div class="f-wrap-column" style="padding:0 5px;">
              <JsonView :data="pkgInfo.__circulation__ ?? '该依赖不存在循环引用'" />
            </div>
          </ElTabPane>
          <ElTabPane label="多版本" name="versions">
            <div class="f-wrap-column" style="padding:0 5px;">
              <JsonView :data="pkgInfo.__versions__ ?? '不存在多个版本'" />
            </div>
          </ElTabPane>
          <ElTabPane label="多版本信息" name="extra">
            <div class="f-wrap-column" style="padding:0 5px;">
              <JsonView :data="pkgInfo.__versions__ ?? '不存在多个版本'" />
            </div>
          </ElTabPane>
        </ElTabs>
      </ElScrollbar>
    </ElDrawer>
  </div>
</template>

<style scoped>
.f-wrap-column {
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
}
.tag {
  margin-right:8px;
  cursor: pointer;
}
</style>
