<script setup lang="ts">
import { type Ref, inject, ref } from 'vue'
import { ArrowDown } from '@element-plus/icons-vue'
import { getPkgInfo } from '../../../utils/chart/index'
import type { PkgInfo } from '../../../types'

const pkgName = inject<Ref<string>>('pkgName')!
const pkgInfo = inject<Ref<PkgInfo>>('pkgInfo')!
const drawer = inject<Ref<boolean>>('drawer')
const showType = ref('info')

function handleTagChange() {
  if (pkgName.value === '__root__') {
    ElMessage('请查看项目根目录的 package.json')
    return
  }
  window.open(`https://npmjs.com/package/${pkgName.value}`)
}

function handlePkgInfo(command: string) {
  showType.value = command
  pkgInfo.value = getPkgInfo(pkgName.value)
}
</script>

<template>
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
    <JsonView :show-info="showType" :pkg-info="pkgInfo" />
  </ElDrawer>
</template>

<style scoped>
.pkgName {
  font-weight: 700;
  font-size: 20px;
  overflow: hidden;
  white-space: nowrap;
  color: var(--el-text-color-primary);
}
</style>

<style>
.el-button+.el-button {
  margin-left: 0;
}
.el-drawer__header {
  margin-bottom: 10px;
}
.el-drawer {
  box-shadow: var(--el-box-shadow-lighter);
}
.modal {
  position: unset!important;
}
</style>
