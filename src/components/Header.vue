<template>
  <header class="h-[8vh] min-h-[60px] flex items-center justify-between px-6 bg-white border border-slate-200 relative shadow-sm mx-4 rounded-xl">
    <!-- Left Section -->
    <div class="flex items-center space-x-4 w-1/3">
      <div class="text-slate-600 text-lg font-medium tracking-wider">
        {{ currentTime }}
      </div>
    </div>

    <!-- Center Section: Title -->
    <div class="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center w-1/3 pointer-events-none">
      <h1 class="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400 tracking-widest" style="text-shadow: 0 0 20px rgba(59, 130, 246, 0.5);">
        西南计量中心集中监控平台
      </h1>
    </div>

    <!-- Right Section: Time Dimension -->
    <div class="flex items-center justify-end space-x-4 w-1/3 z-10 relative">
      <el-radio-group v-model="globalState.timeDimension" size="small" class="custom-radio" @change="handleTimeDimensionChange">
        <el-radio-button label="日" value="day" />
        <el-radio-button label="月" value="month" />
        <el-radio-button label="年" value="year" />
      </el-radio-group>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useDateFormat, useNow } from '@vueuse/core'
import { globalState } from '../store'
import { ElMessage } from 'element-plus'

const now = useNow()
const currentTime = useDateFormat(now, 'YYYY-MM-DD HH:mm:ss dddd')

const handleTimeDimensionChange = (val: string | number | boolean) => {
  const dimensionMap: Record<string, string> = {
    day: '日',
    month: '月',
    year: '年'
  }
  ElMessage({
    message: `已切换至【${dimensionMap[val as string]}】维度，所有统计数据已刷新。`,
    type: 'success',
    duration: 2000
  })
  
  // 这里可以通过事件总线、store 或者暴露方法等方式，通知其他组件重新获取数据
  // 目前因为使用的是 reactive 响应式 store，其他依赖 globalState.timeDimension 的组件会自动响应
}
</script>

<style scoped>
.custom-radio :deep(.el-radio-button__inner) {
  background-color: transparent;
  border-color: #cbd5e1;
  color: #64748b;
}
.custom-radio :deep(.el-radio-button__original-radio:checked + .el-radio-button__inner) {
  background-color: #2563eb;
  border-color: #2563eb;
  color: white;
  box-shadow: none;
}
</style>
