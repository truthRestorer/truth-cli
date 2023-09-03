<script setup lang="ts">
import { type Ref, inject, ref } from 'vue'
import { ArrowDown } from '@element-plus/icons-vue'
import { getPkgInfo } from '../../utils/index'
import type { PkgInfo, ShowType } from '../../types'

const pkgName = inject<Ref<string>>('pkgName')!
const pkgInfo = inject<Ref<PkgInfo>>('pkgInfo')!
const drawer = inject<Ref<boolean>>('drawer')
const type = ref<ShowType>('info')

const infoMap: Record<string, string> = {
  info: '依赖信息',
  circulation: '循环依赖',
  versions: '版本引用',
  extra: '其他版本',
}

function handlePkgInfo(command: ShowType) {
  type.value = command
  pkgInfo.value = getPkgInfo(pkgName.value)
}
</script>

<template>
  <Transition>
    <div v-if="drawer" class="drawer">
      <ElScrollbar>
        <div class="drawer_header">
          <div class="pkgName">
            <ElScrollbar>
              {{ pkgName }}
            </ElScrollbar>
          </div>
          <ElDropdown trigger="click" @command="handlePkgInfo">
            <ElButton>
              {{ infoMap[type] }}
              <ElIcon title="查看依赖信息" class="el-icon--right">
                <ArrowDown />
              </ElIcon>
            </ElButton>
            <template #dropdown>
              <ElDropdownMenu>
                <ElDropdownItem v-for="(value, key) in infoMap" :key="value" :command="key">
                  {{ value }}
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
          <div v-if="pkgInfo[type]">
            <Json :data="pkgInfo[type]" :type="type" />
          </div>
          <div v-else class="value">
            未找到{{ infoMap[type] }}信息
          </div>
        </ElScrollbar>
      </ElScrollbar>
    </div>
  </Transition>
</template>

<style scoped>
.drawer {
  position: absolute;
  z-index: 998;
  top: 50px;
  height: 100%;
  padding-bottom: 80px;
  width: 300px;
  translate: 0px;
  padding: 16px;
  background-color: var(--el-bg-color);
  box-shadow: var(--el-box-shadow-light);
}
.drawer_header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  padding-right: 12px;
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
