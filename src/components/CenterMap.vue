<template>
  <div class="flex flex-col relative p-4 h-full">
    <!-- 顶部标题 -->
    <h2 class="relative z-10 text-xl font-bold text-blue-600 mb-4 flex items-center">
      <span class="w-1 h-4 bg-blue-600 mr-2 rounded-full"></span>
      30天趋势监控
    </h2>

    <!-- 30天趋势图 -->
    <div class="relative z-10 flex-1 border border-slate-200 rounded-lg bg-white p-4 shadow-sm">
      <v-chart class="w-full h-full" :option="trendOption" autoresize />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart } from 'echarts/charts'
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent
} from 'echarts/components'
import VChart from 'vue-echarts'

use([
  CanvasRenderer,
  BarChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent
])

const trendOption = ref({
  tooltip: {
    trigger: 'axis',
    axisPointer: { type: 'shadow' }
  },
  legend: {
    data: ['日输气量(万m³)', '报警数'],
    textStyle: { color: '#475569' },
    top: 0,
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    top: '15%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: Array.from({length: 30}, (_, i) => `11-${i+1}`),
    axisLabel: { color: '#64748b' }
  },
  yAxis: [
    {
      type: 'value',
      name: '输气量',
      nameTextStyle: { color: '#64748b' },
      axisLabel: { color: '#64748b' },
      splitLine: { lineStyle: { color: '#e2e8f0' } }
    },
    {
      type: 'value',
      name: '报警数',
      nameTextStyle: { color: '#64748b' },
      axisLabel: { color: '#64748b' },
      splitLine: { show: false }
    }
  ],
  series: [
    {
      name: '日输气量(万m³)',
      type: 'bar',
      barMaxWidth: 20,
      itemStyle: { color: '#3b82f6', borderRadius: [4, 4, 0, 0] },
      label: { show: true, position: 'top', color: '#475569', fontSize: 10 },
      data: Array.from({length: 30}, () => Math.floor(Math.random() * 500 + 800))
    },
    {
      name: '报警数',
      type: 'bar',
      yAxisIndex: 1,
      barMaxWidth: 20,
      itemStyle: { color: '#ef4444', borderRadius: [4, 4, 0, 0] },
      label: { show: true, position: 'top', color: '#475569', fontSize: 10 },
      data: Array.from({length: 30}, () => Math.floor(Math.random() * 5))
    }
  ]
})
</script>