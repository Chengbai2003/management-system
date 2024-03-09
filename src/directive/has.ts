import pinia from '@/store'
import useUserStore from '@/store/modules/user'
const userStore = useUserStore(pinia)
export const isHasButton = (app: any) => {
  // 获取对应用户仓库
  app.directive('has', {
    // 代表全局自定义指令 Dom|组件 挂载完毕执行一次
    mounted(el: any, options: any) {
      if (!userStore.buttons.includes(options.value)) {
        el.disabled = true
      }
    },
  })
}
