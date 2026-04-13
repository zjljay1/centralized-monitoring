<template>
  <div class="flex flex-col relative">
    <h2 class="text-xl font-bold text-blue-600 mb-2 flex items-center">
      <span class="w-1 h-4 bg-blue-600 mr-2 rounded-full"></span>
      计量回路监视
    </h2>
    
    <!-- 环形图区域 -->
    <div class="flex h-[35%] gap-2 mb-2">
      <div class="flex-1 bg-slate-50 rounded border border-slate-200 p-2 relative shadow-sm">
        <h3 class="absolute top-2 left-2 text-sm text-slate-500">天然气回路状态</h3>
        <v-chart class="w-full h-full" :option="gasPieOption" autoresize @click="handlePieClick" />
      </div>
      <div class="flex-1 bg-slate-50 rounded border border-slate-200 p-2 relative shadow-sm">
        <h3 class="absolute top-2 left-2 text-sm text-slate-500">成品油回路状态</h3>
        <v-chart class="w-full h-full" :option="oilPieOption" autoresize @click="handlePieClick" />
      </div>
    </div>

    <!-- 声速核查统计 -->
    <div class="h-[25%] bg-slate-50 rounded border border-slate-200 p-2 mb-2 relative flex flex-col justify-center shadow-sm">
      <h3 class="absolute top-2 left-2 text-sm text-slate-500 z-10">天然气声速核查</h3>
      <div class="flex h-full items-center justify-center gap-8 mt-4">
        <div class="flex flex-col items-center">
          <div class="text-emerald-500 font-bold text-3xl mb-1">115</div>
          <div class="text-slate-500 text-sm flex items-center"><span class="w-2 h-2 rounded-full bg-emerald-500 mr-2"></span>核查通过</div>
        </div>
        <div class="h-12 w-px bg-slate-200"></div>
        <div class="flex flex-col items-center">
          <div class="text-red-500 font-bold text-3xl mb-1">5</div>
          <div class="text-slate-500 text-sm flex items-center"><span class="w-2 h-2 rounded-full bg-red-500 mr-2"></span>未通过</div>
        </div>
      </div>
    </div>

    <!-- 分公司统计柱状图 -->
    <div class="flex-1 bg-slate-50 rounded border border-slate-200 p-2 relative shadow-sm">
      <h3 class="absolute top-2 left-2 text-sm text-slate-500 z-10">分公司回路分布</h3>
      <v-chart class="w-full h-full" :option="barOption" autoresize />
    </div>

    <!-- 详情弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="`回路详情 - ${currentStatus}`"
      width="60%"
      append-to-body
    >
      <el-table :data="mockDetailData" height="400px">
        <el-table-column prop="id" label="回路编号" width="120" />
        <el-table-column prop="station" label="所属场站" />
        <el-table-column prop="company" label="所属分公司" />
        <el-table-column prop="time" label="状态更新时间" width="180" />
        <el-table-column prop="desc" label="状态描述" show-overflow-tooltip />
      </el-table>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { PieChart, BarChart } from 'echarts/charts'
import {
  TooltipComponent,
  LegendComponent,
  GridComponent
} from 'echarts/components'
import VChart from 'vue-echarts'

use([
  CanvasRenderer,
  PieChart,
  BarChart,
  TooltipComponent,
  LegendComponent,
  GridComponent
])

const dialogVisible = ref(false)
const currentStatus = ref('')

const colorPalette = {
  '在用': '#10b981', // 正常
  '备用': '#3b82f6', // 蓝
  '停用': '#64748b', // 离线
  '故障': '#ef4444'  // 报警
}

const createPieOption = (data: any[], name: string) => ({
  tooltip: { trigger: 'item' },
  legend: {
    orient: 'vertical',
    right: 0,
    top: 'center',
    itemWidth: 10,
    itemHeight: 10,
    textStyle: { color: '#64748b', fontSize: 10 }
  },
  series: [
    {
      name,
      type: 'pie',
      radius: ['35%', '60%'],
      center: ['40%', '55%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderColor: '#ffffff',
        borderWidth: 2
      },
      label: { show: true, formatter: '{b}\n{c}', color: '#1e293b', fontSize: 12 },
      labelLine: { show: true, length: 5, length2: 5 },
      data: data.map(item => ({
        ...item,
        itemStyle: { color: colorPalette[item.name as keyof typeof colorPalette] }
      }))
    }
  ]
})

const gasData = [
  { value: 120, name: '在用' },
  { value: 30, name: '备用' },
  { value: 10, name: '停用' },
  { value: 5, name: '故障' }
]

const oilData = [
  { value: 80, name: '在用' },
  { value: 20, name: '备用' },
  { value: 8, name: '停用' },
  { value: 2, name: '故障' }
]

const gasPieOption = ref(createPieOption(gasData, '天然气回路'))
const oilPieOption = ref(createPieOption(oilData, '成品油回路'))

const barOption = ref({
  tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
  legend: {
    data: ['天然气', '成品油'],
    top: 0,
    right: 0,
    textStyle: { color: '#64748b', fontSize: 10 }
  },
  grid: { left: '3%', right: '4%', bottom: '3%', top: '25%', containLabel: true },
  xAxis: { type: 'value', axisLabel: { color: '#64748b', fontSize: 12 }, splitLine: { lineStyle: { color: '#e2e8f0' } } },
  yAxis: { 
    type: 'category', 
    data: ['成都分公司', '重庆分公司', '贵阳分公司', '昆明分公司'],
    axisLabel: { color: '#64748b', fontSize: 12 }
  },
  series: [
    {
      name: '天然气',
      type: 'bar',
      stack: 'total',
      itemStyle: { color: '#3b82f6' },
      label: { show: true, position: 'inside', color: '#ffffff', fontSize: 12, formatter: (p: any) => p.value > 0 ? p.value : '' },
      data: [45, 38, 25, 12]
    },
    {
      name: '成品油',
      type: 'bar',
      stack: 'total',
      itemStyle: { color: '#10b981' },
      label: { show: true, position: 'inside', color: '#ffffff', fontSize: 12, formatter: (p: any) => p.value > 0 ? p.value : '' },
      data: [20, 22, 18, 5]
    }
  ]
})

const mockDetailData = ref<any[]>([])

const handlePieClick = (params: any) => {
  currentStatus.value = params.name
  // 模拟生成明细数据
  mockDetailData.value = Array.from({ length: params.value }, (_, i) => ({
    id: `CIR-${Math.floor(Math.random() * 10000)}`,
    station: ['成都输气站', '重庆作业区', '贵阳分输站'][Math.floor(Math.random() * 3)],
    company: ['成都分公司', '重庆分公司', '贵阳分公司'][Math.floor(Math.random() * 3)],
    time: new Date(Date.now() - Math.random() * 10000000).toLocaleString(),
    desc: params.name === '故障' ? '传感器通讯中断' : (params.name === '停用' ? '计划性维护停用' : '状态正常')
  }))
  dialogVisible.value = true
}
</script>

<style>
/* 深色表格样式 */
.dark-table {
  --el-table-bg-color: transparent;
  --el-table-tr-bg-color: transparent;
  --el-table-header-bg-color: rgba(30, 41, 59, 0.5);
  --el-table-header-text-color: #94a3b8;
  --el-table-text-color: #cbd5e1;
  --el-table-border-color: #334155;
  --el-table-row-hover-bg-color: rgba(59, 130, 246, 0.1);
  background-color: transparent;
}
.dark-table th.el-table__cell {
  background-color: var(--el-table-header-bg-color);
}
</style>