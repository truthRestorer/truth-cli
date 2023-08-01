import * as echarts from 'echarts/core'
import { GraphChart, TreeChart } from 'echarts/charts'
import { LegendComponent, ToolboxComponent, TooltipComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import { LabelLayout, UniversalTransition } from 'echarts/features'

echarts.use([
  TreeChart,
  GraphChart,
  TooltipComponent,
  CanvasRenderer,
  ToolboxComponent,
  LegendComponent,
  LabelLayout,
  UniversalTransition,
])

export default echarts
