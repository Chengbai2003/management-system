// 小仓库 关于layout 的配置
import { defineStore } from 'pinia'

const useLayoutSettingStore = defineStore('SettingStore', {
  state: () => {
    return {
      fold: false, //控制菜单是否折叠
      refresh: false, //控制刷新效果
    }
  },
})

export default useLayoutSettingStore
