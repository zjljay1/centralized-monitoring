<template>
  <div class="flex flex-col relative">
    <div class="flex justify-between items-center mb-2">
      <h2 class="text-xl font-bold text-blue-600 flex items-center">
        <span class="w-1 h-4 bg-blue-600 mr-2 rounded-full"></span>
        设备监视
      </h2>
    </div>
    
    <!-- 设备类型与健康状态分布 (堆叠柱状图) -->
    <div class="flex-[1.5] bg-white rounded-lg border border-slate-200 shadow-sm p-2 mb-2 relative">
      <h3 class="absolute top-2 left-2 text-sm text-slate-500 z-10">设备类型与健康状态</h3>
      <v-chart class="w-full h-full" :option="barOption" autoresize @click="handleBarClick" />
    </div>

    <!-- 品牌分布 (饼图) -->
    <div class="flex-1 bg-white rounded-lg border border-slate-200 shadow-sm p-2 relative">
      <h3 class="absolute top-2 left-2 text-sm text-slate-500 z-10">主要品牌占比</h3>
      <v-chart class="w-full h-full" :option="pieOption" autoresize />
    </div>

    <!-- 设备画像弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="`${currentType} - 设备清单`"
      width="70%"
      append-to-body
    >
      <div class="mb-4 flex gap-4">
        <el-select v-model="filterStatus" size="small" placeholder="状态筛选" clearable>
          <el-option label="在线" value="online" />
          <el-option label="离线" value="offline" />
          <el-option label="送检" value="inspect" />
          <el-option label="故障" value="fault" />
        </el-select>
        <el-select v-model="filterBrand" size="small" placeholder="品牌筛选" clearable>
          <el-option label="埃尔斯特" value="elster" />
          <el-option label="艾默生" value="emerson" />
          <el-option label="西门子" value="siemens" />
        </el-select>
      </div>
      <el-table :data="filteredList" height="400px">
        <el-table-column prop="id" label="设备编号" width="120" />
        <el-table-column prop="type" label="设备类型" />
        <el-table-column prop="brand" label="品牌" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <span :class="{
              'text-emerald-600': row.status === '在线',
              'text-slate-500': row.status === '离线',
              'text-blue-600': row.status === '送检',
              'text-red-600': row.status === '故障'
            }">{{ row.status }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="station" label="所属场站" />
        <el-table-column prop="installDate" label="安装日期" width="120" />
      </el-table>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart, PieChart } from 'echarts/charts'
import { TooltipComponent, LegendComponent, GridComponent } from 'echarts/components'
import VChart from 'vue-echarts'

use([CanvasRenderer, BarChart, PieChart, TooltipComponent, LegendComponent, GridComponent])

const dialogVisible = ref(false)
const currentType = ref('')
const filterStatus = ref('')
const filterBrand = ref('')

const equipmentTypes = ['流量计算机', '超声流量计', '质量流量计', '涡轮流量计', '色谱分析仪', '压力变送器']

const barOption = computed(() => {
  const labelConfig = { show: true, position: 'inside', color: '#fff', fontSize: 12, formatter: (p: any) => p.value > 0 ? p.value : '' };
  return {
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    legend: {
      data: ['在线', '离线', '送检', '故障'],
      top: 0,
      right: 0,
      textStyle: { color: '#475569', fontSize: 10 }
    },
    grid: { left: '3%', right: '4%', bottom: '3%', top: '25%', containLabel: true },
    xAxis: { 
      type: 'category', 
      data: equipmentTypes,
      axisLabel: { color: '#475569', interval: 0, rotate: 30, fontSize: 12 }
    },
    yAxis: { type: 'value', interval: 20, axisLabel: { color: '#64748b', fontSize: 12 }, splitLine: { lineStyle: { color: '#e2e8f0' } } },
    series: [
      { name: '在线', type: 'bar', stack: 'total', itemStyle: { color: '#10b981' }, label: labelConfig, data: [120, 80, 60, 40, 30, 150] },
      { name: '离线', type: 'bar', stack: 'total', itemStyle: { color: '#64748b' }, label: labelConfig, data: [5, 10, 5, 2, 1, 15] },
      { name: '送检', type: 'bar', stack: 'total', itemStyle: { color: '#3b82f6' }, label: labelConfig, data: [2, 5, 3, 1, 4, 10] },
      { name: '故障', type: 'bar', stack: 'total', itemStyle: { color: '#ef4444' }, label: labelConfig, data: [1, 2, 1, 0, 1, 3] }
    ]
  };
})

const pieOption = computed(() => ({
  tooltip: { trigger: 'item' },
  legend: {
    orient: 'vertical',
    right: 0,
    top: 'center',
    textStyle: { color: '#475569', fontSize: 10 }
  },
  series: [
    {
      name: '品牌占比',
      type: 'pie',
      radius: ['35%', '60%'],
      center: ['40%', '50%'],
      itemStyle: { borderColor: '#ffffff', borderWidth: 2 },
      label: { show: true, formatter: '{b}\n{c}', color: '#475569', fontSize: 12 },
      labelLine: { show: true, length: 5, length2: 5 },
      data: [
        { value: 35, name: '埃尔斯特', itemStyle: { color: '#3b82f6' } },
        { value: 25, name: '艾默生', itemStyle: { color: '#10b981' } },
        { value: 15, name: '中核维斯', itemStyle: { color: '#f59e0b' } },
        { value: 10, name: '西克', itemStyle: { color: '#8b5cf6' } },
        { value: 15, name: '其他', itemStyle: { color: '#64748b' } }
      ]
    }
  ]
}))

const mockList = ref<any[]>([])

const handleBarClick = (params: any) => {
  currentType.value = params.name
  mockList.value = Array.from({ length: 20 }, (_, i) => ({
    id: `EQ-${Math.floor(Math.random() * 10000)}`,
    type: params.name,
    brand: ['埃尔斯特', '艾默生', '西门子'][Math.floor(Math.random() * 3)],
    status: ['在线', '在线', '在线', '离线', '送检', '故障'][Math.floor(Math.random() * 6)],
    station: ['成都输气站', '重庆作业区', '贵阳分输站'][Math.floor(Math.random() * 3)],
    installDate: `202${Math.floor(Math.random() * 4)}-0${Math.floor(Math.random() * 9 + 1)}-15`
  }))
  dialogVisible.value = true
}

const filteredList = computed(() => {
  return mockList.value.filter(item => {
    let sMatch = true
    let bMatch = true
    if (filterStatus.value) {
      const sMap: Record<string, string> = { online: '在线', offline: '离线', inspect: '送检', fault: '故障' }
      sMatch = item.status === sMap[filterStatus.value]
    }
    if (filterBrand.value) {
      const bMap: Record<string, string> = { elster: '埃尔斯特', emerson: '艾默生', siemens: '西门子' }
      bMatch = item.brand === bMap[filterBrand.value]
    }
    return sMatch && bMatch
  })
})
</script>

