import SvgIcon from './SvgIcon/index.vue'
import Pagination from './Pagination/index.vue'
import Category from './Category/index.vue'
//引入element-plus的全部图标组件
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const allGlobalComponents = { SvgIcon, Pagination, Category }
// 对外暴露插件对象
export default {
  install(app: any) {
    // 注册项目
    Object.keys(allGlobalComponents).forEach((key: string) => {
      //@ts-expect-error 会报错 有隐式的any
      app.component(key, allGlobalComponents[key])
    })
    // 将elementplus提供的图标注册为全局组件
    for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
      app.component(key, component)
    }
  },
}
