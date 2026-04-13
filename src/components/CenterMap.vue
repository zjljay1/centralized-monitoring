<template>
  <div class="flex flex-col relative p-4 h-full">
    <!-- 顶部标题 -->
    <h2 class="relative z-10 text-xl font-bold text-blue-600 mb-4 flex items-center">
      <span class="w-1 h-4 bg-blue-600 mr-2 rounded-full"></span>
      西南区域地理分布
    </h2>

    <!-- 地图区域 -->
    <div class="relative z-10 flex-1 border border-slate-200 rounded-lg bg-white p-0 shadow-sm overflow-hidden flex">
      <!-- 悬浮统计面板 -->
      <div class="absolute top-4 left-4 z-20 bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-md border border-slate-200 pointer-events-auto flex flex-col gap-3 min-w-[160px]">
        <div class="flex justify-between items-center">
          <span class="text-sm text-slate-600 flex items-center"><span class="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>上载点</span>
          <span class="font-bold text-blue-600 text-lg">12</span>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-sm text-slate-600 flex items-center"><span class="w-2 h-2 rounded-full bg-purple-500 mr-2"></span>转供点</span>
          <span class="font-bold text-purple-600 text-lg">8</span>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-sm text-slate-600 flex items-center"><span class="w-2 h-2 rounded-full bg-orange-500 mr-2"></span>下载点</span>
          <span class="font-bold text-orange-600 text-lg">45</span>
        </div>
        <div class="h-px w-full bg-slate-200 my-1"></div>
        <div class="flex justify-between items-center">
          <span class="text-sm text-slate-600">计量回路总数</span>
          <span class="font-bold text-emerald-600 text-lg">150</span>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-sm text-slate-600">计量设备总数</span>
          <span class="font-bold text-indigo-600 text-lg">320</span>
        </div>
      </div>

      <v-chart class="w-full h-full" :option="mapOption" autoresize />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { use, registerMap } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { MapChart, EffectScatterChart } from 'echarts/charts'
import {
  GeoComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent
} from 'echarts/components'
import VChart from 'vue-echarts'
import southwestJson from '../assets/southwest.json'

use([
  CanvasRenderer,
  MapChart,
  EffectScatterChart,
  GeoComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent
])

registerMap('southwest', southwestJson as any)

// 模拟西南区域坐标点
const uploadPoints = [
  { name: '成都上载点', value: [104.06, 30.67] },
  { name: '重庆上载点', value: [106.50, 29.53] },
  { name: '贵阳上载点', value: [106.71, 26.57] }
]

const transferPoints = [
  { name: '绵阳转供点', value: [104.73, 31.46] },
  { name: '遵义转供点', value: [106.91, 27.73] },
  { name: '南充转供点', value: [106.08, 30.79] }
]

const downloadPoints = [
  { name: '德阳下载点', value: [104.40, 31.13] },
  { name: '宜宾下载点', value: [104.62, 28.77] },
  { name: '泸州下载点', value: [105.44, 28.87] },
  { name: '六盘水下载点', value: [104.82, 26.58] }
]

const mapOption = ref({
  tooltip: {
    trigger: 'item',
    formatter: function (params: any) {
      return `${params.seriesName}<br/>${params.name}`
    }
  },
  legend: {
    data: ['上载点', '转供点', '下载点'],
    textStyle: { color: '#475569' },
    top: 10,
    right: 20
  },
  geo: {
    map: 'southwest',
    roam: true,
    zoom: 1.1, // 自动居中后稍微放大一点以填满容器
    scaleLimit: {
      min: 1,
      max: 10
    },
    label: {
      show: true,
      color: '#64748b',
      fontSize: 10
    },
    itemStyle: {
      areaColor: '#f1f5f9',
      borderColor: '#cbd5e1'
    },
    emphasis: {
      label: {
        show: true,
        color: '#1e293b'
      },
      itemStyle: {
        areaColor: '#bae6fd'
      }
    }
  },
  series: [
    {
      name: '上载点',
      type: 'effectScatter',
      coordinateSystem: 'geo',
      data: uploadPoints,
      symbolSize: 6, // 缩小点的大小
      itemStyle: {
        color: '#3b82f6', // blue
        shadowBlur: 5,
        shadowColor: '#3b82f6'
      },
      zlevel: 1
    },
    {
      name: '转供点',
      type: 'effectScatter',
      coordinateSystem: 'geo',
      data: transferPoints,
      symbolSize: 6, // 缩小点的大小
      itemStyle: {
        color: '#a855f7', // purple
        shadowBlur: 5,
        shadowColor: '#a855f7'
      },
      zlevel: 1
    },
    {
      name: '下载点',
      type: 'effectScatter',
      coordinateSystem: 'geo',
      data: downloadPoints,
      symbolSize: 6, // 缩小点的大小
      itemStyle: {
        color: '#f97316', // orange
        shadowBlur: 5,
        shadowColor: '#f97316'
      },
      zlevel: 1
    }
  ]
})
</script>
