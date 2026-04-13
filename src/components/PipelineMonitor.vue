<template>
  <div class="flex flex-col relative">
    <h2 class="text-xl font-bold text-blue-600 mb-4 flex items-center">
      <span class="w-1 h-4 bg-blue-600 mr-2 rounded-full"></span>
      管线监视
    </h2>
    
    <!-- 总览卡片 -->
    <div class="flex gap-4 flex-1">
      <div 
        class="flex-1 bg-slate-50 border border-blue-200 rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50 transition-colors group shadow-sm"
        @click="openDetail('gas')"
      >
        <div class="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
          <Wind class="w-6 h-6 text-blue-600" />
        </div>
        <div class="text-slate-600 text-base mb-1">天然气管线</div>
        <div class="text-4xl font-bold text-blue-600">24<span class="text-base font-normal text-slate-400 ml-1">条</span></div>
      </div>
      
      <div 
        class="flex-1 bg-slate-50 border border-emerald-200 rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-emerald-50 transition-colors group shadow-sm"
        @click="openDetail('oil')"
      >
        <div class="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
          <Droplet class="w-6 h-6 text-emerald-600" />
        </div>
        <div class="text-slate-600 text-base mb-1">成品油管线</div>
        <div class="text-4xl font-bold text-emerald-600">12<span class="text-base font-normal text-slate-400 ml-1">条</span></div>
      </div>
    </div>

    <!-- 详情弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'gas' ? '天然气管线详情' : '成品油管线详情'"
      width="70%"
      append-to-body
    >
      <div class="flex gap-4 h-[50vh]">
        <!-- 管线列表 -->
        <div class="w-1/3 border-r border-slate-200 pr-4 overflow-y-auto">
          <h3 class="text-slate-700 mb-3 font-bold">管线列表</h3>
          <div class="space-y-2">
            <div 
              v-for="item in currentList" 
              :key="item.id"
              class="p-3 rounded bg-slate-50 border border-slate-200 hover:border-blue-500 cursor-pointer transition-colors"
              :class="{'border-blue-500 bg-blue-50': selectedPipeline?.id === item.id}"
              @click="selectedPipeline = item"
            >
              <div class="font-medium text-slate-800">{{ item.name }}</div>
              <div class="text-xs text-slate-500 mt-1 flex justify-between">
                <span>长度: {{ item.length }}km</span>
                <span>场站数: {{ item.stations?.length || 0 }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 关联场站与拓扑 -->
        <div class="w-2/3 pl-4 flex flex-col">
          <h3 class="text-slate-700 mb-3 font-bold">关联场站拓扑</h3>
          <div v-if="selectedPipeline" class="flex-1 bg-slate-50 rounded border border-slate-200 p-4 flex flex-col">
            <div class="mb-4 text-sm text-slate-500">
              当前管线: <span class="text-blue-600">{{ selectedPipeline.name }}</span>，
              共经过 <span class="text-emerald-600 font-bold">{{ selectedPipeline?.stations?.length || 0 }}</span> 个场站
            </div>
            
            <!-- 简单的横向拓扑图 -->
            <div class="flex-1 flex items-center justify-center overflow-x-auto">
              <div class="flex items-center space-x-2 min-w-max px-4">
                <template v-for="(station, index) in selectedPipeline?.stations || []" :key="index">
                  <div class="flex flex-col items-center">
                    <div class="w-10 h-10 rounded-full bg-white border-2 border-emerald-500 shadow-sm flex items-center justify-center z-10">
                      <Box class="w-5 h-5 text-emerald-500" />
                    </div>
                    <span class="text-xs text-slate-600 mt-2 w-16 text-center truncate">{{ station }}</span>
                  </div>
                  <div v-if="Number(index) < (selectedPipeline?.stations?.length || 0) - 1" class="h-1 w-16 bg-blue-200"></div>
                </template>
              </div>
            </div>
          </div>
          <div v-else class="flex-1 flex items-center justify-center text-slate-400">
            请在左侧选择一条管线查看详情
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Wind, Droplet, Box } from 'lucide-vue-next'

const dialogVisible = ref(false)
const dialogType = ref<'gas' | 'oil'>('gas')

// 模拟数据
const mockGasPipelines = Array.from({ length: 24 }, (_, i) => ({
  id: `gas-${i+1}`,
  name: `天然气干线 ${i+1}线`,
  length: Math.floor(Math.random() * 500 + 100),
  stations: Array.from({ length: Math.floor(Math.random() * 5 + 3) }, (_, j) => `天然气站${i}-${j}`)
}))

const mockOilPipelines = Array.from({ length: 12 }, (_, i) => ({
  id: `oil-${i+1}`,
  name: `成品油管道 ${i+1}号`,
  length: Math.floor(Math.random() * 300 + 50),
  stations: Array.from({ length: Math.floor(Math.random() * 4 + 2) }, (_, j) => `油库${i}-${j}`)
}))

const currentList = computed(() => dialogType.value === 'gas' ? mockGasPipelines : mockOilPipelines)
const selectedPipeline = ref<any>(null)

const openDetail = (type: 'gas' | 'oil') => {
  dialogType.value = type
  selectedPipeline.value = currentList.value[0]
  dialogVisible.value = true
}
</script>

<style>
/* 弹窗样式将使用 Element Plus 默认的亮色主题，因此删除了之前的 dark-dialog 覆盖 */
</style>