<script setup lang="ts">
import { ElButton, ElIcon, ElInput } from 'element-plus'
import type { Ref } from 'vue'
import { inject, ref } from 'vue'
import { debounce } from '../utils'
import Github from './Github.vue'

const lengend = ref<'Tree' | 'Force'>('Tree')
const drawer = inject('drawer')
const pkgName = inject<Ref<string>>('pkgName')!
const pkgInfo = inject<Ref<any>>('pkgInfo')!
const chartInstance = inject<any>('chartInstance')
const handleSearch = debounce(() => {
  const searchResult = chartInstance.getPkgInfo(pkgName.value)
  if (searchResult)
    pkgInfo.value = searchResult
})
</script>

<template>
  <div class="header">
    <div class="left">
      <div class="logo">
        Truth-cli
      </div>
    </div>
    <div class="right">
      <ElInput v-model="pkgName" placeholder="搜索依赖" @input="handleSearch">
        <template #suffix>
          <ElIcon>
            <Search />
          </ElIcon>
        </template>
      </ElInput>
      <ElButton @click="drawer = !drawer">
        {{ drawer ? '关闭' : '打开' }}信息框
      </ElButton>
      <ElButton @click="lengend = chartInstance.toggleLegend(lengend)">
        切换图表
      </ElButton>
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
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  background-color: #fefefe;
  padding: 8px 15px 8px 40px;
  max-height: 60px;
  box-shadow: 0 1px 12px #efefef;
  & .right, .left, .link{
    display: flex;
    align-items: center;
    gap: 20px;
  }
  & .right {
    flex: 1;
  }
  & .left {
    flex: 1;
    justify-content: center;
    & .logo {
      font-size: 24px;
      font-weight: 500;
      letter-spacing: 8px;
    }
  }
  & .link {
    display: flex;
    align-items: center;
    min-width: max-content;
    & a {
      color: #434343;
      font-size: 14px;
      text-decoration: none;
      border-bottom: 2px solid transparent;
      transition: border-color 0.25s;
    }
    & a:hover {
      border-color: #75dcff;
      color: #1a1b1b;
    }
  }
}
</style>
