<script setup lang="ts">
import { type Ref, inject, ref } from 'vue'
import type { Legend } from '../../../types'
import { debounce } from '../../../utils/debounce'
import { collapseNode, getPkgInfo, toggleChart } from '../../../utils/chart'

const pkgName = inject<Ref<string>>('pkgName')!
const pkgInfo = inject<Ref<any>>('pkgInfo')!
const drawer = inject<Ref<boolean>>('drawer')
const legend = ref<Legend>('Graph')

const handleSearch = debounce(() => {
  pkgInfo.value = getPkgInfo(pkgName.value)
})
</script>

<template>
  <div class="header">
    <div class="left">
      Truth-cli
    </div>
    <div class="right">
      <ElInput v-model="pkgName" placeholder="搜索依赖" @input="handleSearch">
        <template #suffix>
          <ElIcon>
            <Search />
          </ElIcon>
        </template>
      </ElInput>
      <ElButton @click="() => collapseNode(legend)">
        折叠节点
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
.left {
  font-size: 26px;
}
</style>
