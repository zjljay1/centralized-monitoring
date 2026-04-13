<template>
  <div class="flex flex-col relative">
    <div class="flex justify-between items-center mb-2">
      <h2 class="text-xl font-bold text-blue-600 flex items-center">
        <span class="w-1 h-4 bg-blue-600 mr-2 rounded-full"></span>
        交接量监视
      </h2>
      <div class="text-sm text-slate-500 flex gap-4">
        <span class="flex items-center"><ArrowDown class="w-4 h-4 text-emerald-500 mr-1" />上载点</span>
        <span class="flex items-center"><ArrowUp class="w-4 h-4 text-blue-500 mr-1" />下载点</span>
      </div>
    </div>

    <div class="flex-1 flex gap-4 overflow-hidden">
      <!-- 左侧：分公司累计量排名 -->
      <div class="w-1/3 bg-white rounded-lg border border-slate-200 shadow-sm p-2 flex flex-col">
        <h3 class="text-sm text-slate-500 mb-2">分公司累计量TOP排名 (万m³)</h3>
        <div class="flex-1 overflow-y-auto pr-2 space-y-3">
          <div v-for="(item, index) in branchRanking" :key="index" class="flex flex-col gap-1">
            <div class="flex justify-between text-base">
              <span class="text-slate-700">
                <span class="inline-block w-5 h-5 rounded text-center leading-5 text-sm mr-2" 
                  :class="index < 3 ? 'bg-orange-100 text-orange-600' : 'bg-slate-100 text-slate-500'">
                  {{ index + 1 }}
                </span>
                {{ item.name }}
              </span>
              <span class="text-blue-600 font-mono font-bold">{{ item.value }}</span>
            </div>
            <el-progress :percentage="item.percent" :show-text="false" color="#3b82f6" :stroke-width="6" />
          </div>
        </div>
      </div>

      <!-- 右侧：关键节点交接量监控 -->
      <div class="flex-1 bg-white rounded-lg border border-slate-200 shadow-sm p-2 flex flex-col">
        <h3 class="text-sm text-slate-500 mb-2">关键节点交接量监控</h3>
        <div class="flex-1 overflow-y-auto pr-2 space-y-2">
          <div v-for="(node, index) in keyNodes" :key="index" class="bg-slate-50 rounded p-2 border border-slate-200 hover:border-blue-400 transition-colors">
            <div class="flex justify-between items-center mb-1">
              <div class="flex items-center gap-2">
                <div class="w-6 h-6 rounded-full flex items-center justify-center bg-slate-200">
                  <ArrowDown v-if="node.type === 'upload'" class="w-4 h-4 text-emerald-600" />
                  <ArrowUp v-else class="w-4 h-4 text-blue-600" />
                </div>
                <span class="text-slate-700 text-base font-medium">{{ node.name }}</span>
                <span class="text-sm px-1.5 py-0.5 rounded bg-slate-200 text-slate-600">{{ node.type === 'upload' ? '上载' : '下载' }}</span>
              </div>
              <div class="text-right">
                <div class="text-base font-bold" :class="node.type === 'upload' ? 'text-emerald-600' : 'text-blue-600'">
                  {{ node.actual }} <span class="text-sm font-normal text-slate-500">万m³</span>
                </div>
              </div>
            </div>
            
            <!-- 进度条与计划值 -->
            <div class="flex items-center gap-3 text-sm mt-2">
              <div class="flex-1">
                <el-progress 
                  :percentage="Math.min(node.actual / node.plan * 100, 100)" 
                  :color="node.actual >= node.plan ? '#059669' : '#2563eb'"
                  :stroke-width="6"
                  :show-text="false"
                />
              </div>
              <div class="text-slate-500 whitespace-nowrap">
                计划: {{ node.plan }} | 完成率: <span :class="node.actual >= node.plan ? 'text-emerald-600' : 'text-blue-600'">{{ (node.actual / node.plan * 100).toFixed(1) }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ArrowUp, ArrowDown } from 'lucide-vue-next'

const branchRanking = ref([
  { name: '成都分公司', value: 8540.5, percent: 100 },
  { name: '重庆分公司', value: 6230.2, percent: 73 },
  { name: '贵阳分公司', value: 4120.8, percent: 48 },
  { name: '昆明分公司', value: 3580.4, percent: 42 },
  { name: '遵义分公司', value: 2150.0, percent: 25 },
])

const keyNodes = ref([
  { name: '中贵线成都上载点', type: 'upload', actual: 1250, plan: 1200 },
  { name: '川气东送重庆转供点', type: 'download', actual: 890, plan: 1000 },
  { name: '中缅线贵阳上载点', type: 'upload', actual: 650, plan: 650 },
  { name: '昆明城市门站下载点', type: 'download', actual: 420, plan: 450 },
  { name: '遵义支线转供点', type: 'download', actual: 210, plan: 200 },
])
</script>

<style scoped>
.el-progress-bar__outer {
  background-color: #f1f5f9 !important;
}
</style>