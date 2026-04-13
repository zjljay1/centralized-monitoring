<template>
  <div class="flex justify-between items-center bg-white rounded-xl border border-slate-200 shadow-sm p-4">
    <div class="flex-1 flex flex-col items-center border-r border-slate-200">
      <div class="text-slate-500 text-base mb-2 flex items-center">
        <Activity class="w-5 h-5 mr-1 text-emerald-500" />
        当日累计输气量
      </div>
      <div class="text-4xl font-bold text-emerald-600 font-mono">1,234.5<span class="text-base text-slate-400 ml-1">万m³</span></div>
    </div>
    <div class="flex-1 flex flex-col items-center border-r border-slate-200">
      <div class="text-slate-500 text-base mb-2 flex items-center">
        <GitMerge class="w-5 h-5 mr-1 text-blue-500" />
        当前在用回路
      </div>
      <div class="text-4xl font-bold text-blue-600 font-mono">128<span class="text-base text-slate-400 ml-1">个</span></div>
    </div>
    <div class="flex-1 flex flex-col items-center border-r border-slate-200">
      <div class="text-slate-500 text-base mb-2 flex items-center">
        <AlertTriangle class="w-5 h-5 mr-1 text-red-500" />
        A/B类报警数
      </div>
      <div class="text-4xl font-bold text-red-600 font-mono">3<span class="text-base text-slate-400 ml-1">条</span></div>
    </div>
    <div class="flex-1 flex flex-col items-center">
      <div class="text-slate-500 text-base mb-2 flex items-center">
        <Wifi class="w-5 h-5 mr-1 text-emerald-500" />
        设备综合在线率
      </div>
      <div class="text-4xl font-bold text-emerald-600 font-mono">98.5<span class="text-base text-slate-400 ml-1">%</span></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Activity, GitMerge, AlertTriangle, Wifi } from 'lucide-vue-next'
</script>