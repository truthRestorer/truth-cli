<script setup lang="ts">
import { ArrowDown, Moon, Search, Sunny } from '@element-plus/icons-vue'
import { type Ref, inject, ref } from 'vue'
import { useDark } from '@vueuse/core'
import { debounce } from '../utils/debounce'
import type { Legend } from '../types'
import { collapseNode, getPkgInfo, toggleChart } from '../utils/chart'

const showInfo = ref('info')
const pkgName = inject<Ref<string>>('pkgName')!
const pkgInfo = inject<Ref<any>>('pkgInfo')!
const legend = ref<Legend>('Graph')
const drawer = ref(true)

function handleTagChange() {
  if (pkgName.value === '__root__') {
    ElMessage('请查看项目根目录的 package.json')
    return
  }
  window.open(`https://npmjs.com/package/${pkgName.value}`)
}

const handleSearch = debounce(() => {
  pkgInfo.value = getPkgInfo(pkgName.value)
})

function handlePkgInfo(command: string) {
  showInfo.value = command
  pkgInfo.value = getPkgInfo(pkgName.value)
}

const isDark = useDark()
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
    :show-close="false"
    :title="pkgName"
    direction="ltr"
    size="350"
    style="--el-drawer-padding-primary:16px;position:fixed;z-index:998;top:50px;height: 100%;padding-bottom:80px;"
  >
    <template #header>
      <div class="pkgName">
        <ElScrollbar>
          {{ pkgName }}
        </ElScrollbar>
      </div>
      <ElDropdown trigger="click" @command="handlePkgInfo">
        <ElButton type="primary">
          INFO
          <ElIcon class="el-icon--right">
            <ArrowDown />
          </ElIcon>
        </ElButton>
        <template #dropdown>
          <ElDropdownMenu>
            <ElDropdownItem command="info">
              依赖信息
            </ElDropdownItem>
            <ElDropdownItem command="circulation">
              循环依赖
            </ElDropdownItem>
            <ElDropdownItem command="versions">
              版本信息
            </ElDropdownItem>
            <li style="padding:0 16px;">
              <ElButton :checked="true" @click="handleTagChange">
                NPM
              </ElButton>
            </li>
          </ElDropdownMenu>
        </template>
      </ElDropdown>
    </template>
    <ElScrollbar style="font-size:14px;color:var(--el-text-color-primary);line-height:26px;">
      <JsonInfo v-if="showInfo === 'info'" :data="pkgInfo?.info" />
      <JsonCirculation v-else-if="showInfo === 'circulation'" :data="pkgInfo?.circulation" />
      <JsonVersions v-else :data="pkgInfo?.versions" />
    </ElScrollbar>
  </ElDrawer>
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
  box-shadow: 0 1px 4px rgba(100, 100, 100, .3);
  transition: background-color .4s!important;
  & .right, .left, .link{
    display: flex;
    align-items: center;
    gap: 16px;
  }
  & .left {
    font-size: 26px;
  }
  & .link {
    min-width: max-content;
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

.pkgName {
  font-weight: 700;
  font-size: 20px;
  overflow: hidden;
  white-space: nowrap;
  color: var(--el-text-color-primary);
}
</style>
