<script setup lang="ts">
import { type Ref, inject, ref } from 'vue'
import { ArrowDown } from '@element-plus/icons-vue'
import { getPkgInfo } from '../../utils/index'
import type { PkgInfo } from '../../types'

const pkgName = inject<Ref<string>>('pkgName')!
const pkgInfo = inject<Ref<PkgInfo>>('pkgInfo')!
const drawer = inject<Ref<boolean>>('drawer')
const showType = ref<'info' | 'circulation' | 'versions'>('info')

function handlePkgInfo(command: 'info' | 'circulation' | 'versions') {
  showType.value = command
  pkgInfo.value = getPkgInfo(pkgName.value)
}
</script>

<template>
  <Transition>
    <div v-if="drawer" class="drawer">
      <ElScrollbar>
        <div style="display: flex;justify-content: space-between;padding-right: 12px;padding-bottom: 12px;">
          <div class="pkgName">
            <ElScrollbar>
              {{ pkgName }}
            </ElScrollbar>
          </div>
          <ElDropdown trigger="click" @command="handlePkgInfo">
            <ElButton>
              INFO
              <ElIcon title="查看依赖信息" class="el-icon--right">
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
                <ElDropdownItem>
                  <ElButton
                    tag="a"
                    target="_blank"
                    :href="`https://npmjs.com/package/${pkgName}`"
                  >
                    NPM
                  </ElButton>
                </ElDropdownItem>
              </ElDropdownMenu>
            </template>
          </ElDropdown>
        </div>
        <ElScrollbar style="font-size:14px;color:var(--el-text-color-primary);line-height:26px;">
          <JsonView :data="pkgInfo[showType]" :type="showType" />
        </ElScrollbar>
      </ElScrollbar>
    </div>
  </Transition>
</template>

<style scoped>
.drawer {
  position: fixed;
  z-index: 998;
  top: 50px;
  height: 100%;
  padding-bottom: 80px;
  width: 300px;
  translate: 0px;
  padding: 16px 8px;
  background-color: var(--el-bg-color);
  box-shadow: var(--el-box-shadow-light);
}
.v-enter-active,
.v-leave-active {
  transition: translate 0.15s ease-in-out;
}
.v-enter-from,
.v-leave-to {
  translate: -300px;
}
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
</style>