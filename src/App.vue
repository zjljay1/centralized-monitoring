<template>
  <div class="min-h-screen w-full bg-slate-50 text-slate-800 flex flex-col pt-2">
    <!-- Header -->
    <Header />

    <!-- Main Content -->
    <main class="flex-1 p-4 grid grid-cols-1 lg:grid-cols-4 gap-4 h-[92vh] min-h-[900px]">
      <!-- Left Panel (25%) -->
      <div class="col-span-1 flex flex-col gap-4">
        <!-- 设备监视 -->
        <EquipmentMonitor class="flex-[1.2] min-h-0 bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex flex-col" />
        <!-- 计量回路监视 -->
        <CircuitMonitor class="flex-[1.3] min-h-0 bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex flex-col" />
      </div>

      <!-- Center Panel (50%) -->
      <div class="col-span-2 flex flex-col gap-4">
        <!-- Top KPI Dashboard -->
        <TopKPI class="h-[15vh] shrink-0" />
        <!-- 地理管线图 & 趋势图 -->
        <CenterMap class="flex-1 min-h-0 bg-white rounded-xl border border-slate-200 shadow-sm relative overflow-hidden" />
        <!-- 交接量监视 -->
        <VolumeMonitor class="h-[25vh] shrink-0 bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex flex-col" />
      </div>

      <!-- Right Panel (25%) -->
      <div class="col-span-1 flex flex-col gap-4">
        <!-- 报警监视 -->
        <AlarmMonitor class="flex-1 min-h-0 bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex flex-col" />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import Header from './components/Header.vue'
import CircuitMonitor from './components/CircuitMonitor.vue'
import TopKPI from './components/TopKPI.vue'
import CenterMap from './components/CenterMap.vue'
import VolumeMonitor from './components/VolumeMonitor.vue'
import EquipmentMonitor from './components/EquipmentMonitor.vue'
import AlarmMonitor from './components/AlarmMonitor.vue'
</script>

<style>
/* Global reset and dark theme overrides if needed */
</style>
