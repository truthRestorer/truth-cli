import * as echarts from 'echarts/core'
import { GraphChart, TreeChart } from 'echarts/charts'
import { LegendComponent, TooltipComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

echarts.use([
  TreeChart,
  GraphChart,
  TooltipComponent,
  CanvasRenderer,
  LegendComponent,
])

export default echarts
