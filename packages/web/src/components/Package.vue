<!-- eslint-disable no-console -->
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import echarts from '../plugins/echarts'
import { Chart, initData } from '../utils/index'

const pkg = ref('')
const pkgDescription = ref('')
const { nodes, links, tree, relations } = await initData()
const c = new Chart(nodes, links, tree, relations)

// TODO: 显示同个包不同版本，做法：通过 relations.json 做到
// TODO: 希望左边有个能显示对象的方框，用户输入包名可查找相应信息
onMounted(async () => {
  const chartInstance = echarts.init(document.getElementById('chart'))
  c.mountChart(chartInstance)
  chartInstance.on('click', ({ data, seriesType }: any) => {
    pkg.value = data.name
    pkgDescription.value = c.getRelation(data.name)
    if (seriesType === 'graph')
      c.addGraph(data.name)
    console.log(c.getRelation(data.name))
    console.log('是否有循环引用', c.circulatedPkg(data.name))
  })
})
</script>

<template>
  <div id="chart" style="height: 100%;" />
  <div class="pkgShow">
    <input v-model="pkg" class="pkgNmae" type="text">
    <div>
      <div v-for="item in (Object.keys(pkgDescription) as any)" :key="item">
        <span style="font-weight: 700;">{{ item }}: </span>
        <span>{{ pkgDescription[item] }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pkgShow {
  position: absolute;
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  left: 0;
  top: 200px;
  bottom: 0;
  width: 300px;
  overflow: auto;
}
.pkgNmae {
  align-self: center;
}
</style>
