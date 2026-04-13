import { reactive } from 'vue'

export const globalState = reactive({
  timeDimension: 'day' as 'day' | 'month' | 'year',
  selectedCompany: 'all' as string,
  // 其他全局联动状态可以在这里添加
})