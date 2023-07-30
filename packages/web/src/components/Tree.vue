<!-- eslint-disable no-console -->
<script setup lang="ts">
import { onMounted } from 'vue'

// import echarts from '../plugins/echarts'
import * as echarts from 'echarts'

const treeJSON = await fetch('tree.json')
const tree = await treeJSON.json()
const relationsJSON = await fetch('relations.json')
const relations = await relationsJSON.json()

onMounted(() => {
  const myChart = echarts.init(document.getElementById('main'))

  // 绘制图表
  myChart.setOption({
    animation: false,
    series: [
      {
        name: '树状图',
        type: 'tree',
        data: [tree],
        roam: true,
        expandAndCollapse: true,
        animationDuration: 550,
        animationDurationUpdate: 750,
      },
    ],
    tooltip: {},
    toolbox: {
      show: true,
      feature: {
        magicType: {
          type: ['tree', 'graph'],
        },
      },
    },
  })
  myChart.on('click', (param: any) => {
    console.log(param)
    const relation = relations[param.data.name]
    console.log(relation)
  })
})
</script>

<template>
  <div id="main" />
</template>

<style scoped>
#main {
  width: 100%;
  height: 100vh;
}
</style>
