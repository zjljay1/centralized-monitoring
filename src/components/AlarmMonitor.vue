<template>
  <div class="flex flex-col relative">
    <div class="flex justify-between items-center mb-2">
      <h2 class="text-xl font-bold text-red-600 flex items-center">
        <span class="w-1 h-4 bg-red-600 mr-2 rounded-full"></span>
        报警监视
      </h2>
      <el-button size="small" type="primary" plain @click="dialogVisible = true">历史分析</el-button>
    </div>

    <!-- 报警分类占比 -->
    <div class="flex gap-2 mb-3">
      <div class="flex-1 bg-red-50 rounded border border-red-200 p-2 flex items-center justify-between">
        <span class="text-base text-slate-600">A类(紧急)</span>
        <span class="text-3xl font-bold text-red-600">2</span>
      </div>
      <div class="flex-1 bg-orange-50 rounded border border-orange-200 p-2 flex items-center justify-between">
        <span class="text-base text-slate-600">B类(警告)</span>
        <span class="text-3xl font-bold text-orange-600">1</span>
      </div>
    </div>

    <!-- 实时报警滚动列表 -->
    <div class="flex-1 bg-white rounded-lg border border-slate-200 shadow-sm p-2 overflow-hidden flex flex-col relative">
      <h3 class="text-sm text-slate-500 mb-2">实时报警看板</h3>
      <div class="flex-1 overflow-hidden relative">
        <!-- 模拟滚动 -->
        <div class="absolute w-full animate-scroll space-y-2">
          <div v-for="item in realTimeAlarms" :key="item.id" class="p-2 rounded bg-slate-50 border-l-2 border-red-500 flex flex-col gap-1 text-base">
            <div class="flex justify-between">
              <span class="text-red-600 font-bold">{{ item.device }}</span>
              <span class="text-slate-500 text-sm">{{ item.time }}</span>
            </div>
            <div class="text-slate-700">{{ item.desc }}</div>
            <div class="text-slate-500 text-sm">{{ item.location }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 历史分析与详情弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      title="历史报警分析"
      width="80%"
      append-to-body
    >
      <div class="flex flex-col gap-4 h-[60vh]">
        <!-- 图表区 -->
        <div class="flex gap-4 h-1/2">
          <!-- 品牌维度 -->
          <div class="flex-1 bg-slate-50 rounded border border-slate-200 p-2">
            <v-chart class="w-full h-full" :option="brandChartOption" autoresize />
          </div>
          <!-- 分公司维度 -->
          <div class="flex-1 bg-slate-50 rounded border border-slate-200 p-2">
            <v-chart class="w-full h-full" :option="companyChartOption" autoresize />
          </div>
          <!-- 时间趋势 -->
          <div class="flex-1 bg-slate-50 rounded border border-slate-200 p-2">
            <v-chart class="w-full h-full" :option="trendChartOption" autoresize />
          </div>
        </div>

        <!-- 详情列表区 -->
        <div class="flex-1 bg-slate-50 rounded border border-slate-200 p-2 overflow-hidden flex flex-col">
          <h3 class="text-slate-700 mb-2 font-bold pl-2">报警处理跟踪</h3>
          <el-table :data="historyAlarms" class="flex-1" height="100%">
            <el-table-column prop="time" label="报警时间" width="160" />
            <el-table-column prop="level" label="等级" width="80">
              <template #default="{ row }">
                <span :class="row.level === 'A' ? 'text-red-600' : 'text-orange-600'">{{ row.level }}类</span>
              </template>
            </el-table-column>
            <el-table-column prop="device" label="设备" />
            <el-table-column prop="desc" label="描述" show-overflow-tooltip />
            <el-table-column prop="confirm" label="确认状态" width="100">
              <template #default="{ row }">
                <el-tag :type="row.confirm ? 'success' : 'info'" size="small">{{ row.confirm ? '已确认' : '未确认' }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="handle" label="处理状态" width="100">
              <template #default="{ row }">
                <el-tag :type="row.handle ? 'success' : 'warning'" size="small">{{ row.handle ? '已处理' : '未处理' }}</el-tag>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart, LineChart } from 'echarts/charts'
import { TooltipComponent, GridComponent, LegendComponent } from 'echarts/components'
import VChart from 'vue-echarts'

use([CanvasRenderer, BarChart, LineChart, TooltipComponent, GridComponent, LegendComponent])

const dialogVisible = ref(false)

const realTimeAlarms = ref([
  { id: 1, time: '10:23:45', device: '超声流量计 FT-102', desc: '通讯中断，设备离线', location: '成都分公司 - 成都输气站' },
  { id: 2, time: '10:15:22', device: '色谱分析仪 AT-201', desc: '硫化氢超标', location: '重庆分公司 - 重庆作业区' },
  { id: 3, time: '09:45:11', device: '压力变送器 PT-305', desc: '压力异常波动', location: '贵阳分公司 - 贵阳分输站' },
  // 重复数据用于滚动演示
  { id: 4, time: '10:23:45', device: '超声流量计 FT-102', desc: '通讯中断，设备离线', location: '成都分公司 - 成都输气站' },
  { id: 5, time: '10:15:22', device: '色谱分析仪 AT-201', desc: '硫化氢超标', location: '重庆分公司 - 重庆作业区' },
])

const historyAlarms = ref(Array.from({ length: 15 }, (_, i) => ({
  time: `2024-11-${Math.floor(Math.random()*30+1)} 10:00:00`,
  level: Math.random() > 0.3 ? 'A' : 'B',
  device: ['流量计', '变送器', '分析仪'][Math.floor(Math.random()*3)],
  desc: '历史报警测试数据描述',
  confirm: Math.random() > 0.5,
  handle: Math.random() > 0.5
})))

const brandChartOption = ref({
  title: { text: '品牌历史报警', textStyle: { color: '#475569', fontSize: 12 } },
  tooltip: { trigger: 'axis' },
  grid: { left: '10%', right: '5%', bottom: '10%', top: '25%' },
  xAxis: { type: 'category', data: ['埃尔斯特', '艾默生', '西门子'], axisLabel: { color: '#64748b' } },
  yAxis: { type: 'value', splitLine: { show: false }, axisLabel: { color: '#64748b' } },
  series: [{ type: 'bar', data: [12, 8, 15], itemStyle: { color: '#ef4444' }, label: { show: true, position: 'top', color: '#475569', fontSize: 12 } }]
})

const companyChartOption = ref({
  title: { text: '分公司报警分布', textStyle: { color: '#475569', fontSize: 12 } },
  tooltip: { trigger: 'axis' },
  grid: { left: '10%', right: '5%', bottom: '10%', top: '25%' },
  xAxis: { type: 'category', data: ['成都', '重庆', '贵阳'], axisLabel: { color: '#64748b' } },
  yAxis: { type: 'value', splitLine: { show: false }, axisLabel: { color: '#64748b' } },
  series: [{ type: 'bar', data: [20, 15, 10], itemStyle: { color: '#f59e0b' }, label: { show: true, position: 'top', color: '#475569', fontSize: 12 } }]
})

const trendChartOption = ref({
  title: { text: '报警趋势(月)', textStyle: { color: '#475569', fontSize: 12 } },
  tooltip: { trigger: 'axis' },
  grid: { left: '10%', right: '5%', bottom: '10%', top: '25%' },
  xAxis: { type: 'category', data: ['1月', '2月', '3月', '4月', '5月', '6月'], axisLabel: { color: '#64748b' } },
  yAxis: { type: 'value', splitLine: { show: false }, axisLabel: { color: '#64748b' } },
  series: [
    { name: 'A类', type: 'line', data: [5, 2, 4, 1, 3, 2], itemStyle: { color: '#ef4444' }, label: { show: true, position: 'top', color: '#475569', fontSize: 12 } },
    { name: 'B类', type: 'line', data: [10, 8, 12, 5, 9, 7], itemStyle: { color: '#f59e0b' }, label: { show: true, position: 'top', color: '#475569', fontSize: 12 } }
  ]
})
</script>

<style scoped>
@keyframes scroll {
  0% { transform: translateY(0); }
  100% { transform: translateY(-50%); }
}
.animate-scroll {
  animation: scroll 15s linear infinite;
}
.animate-scroll:hover {
  animation-play-state: paused;
}
</style>