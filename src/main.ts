import { createApp } from 'vue'
import App from './App.vue'
import Elementplus from 'element-plus'
// 引入全局样式
import './styles/index.scss'
//@ts-expect-error 是js文件没有ts类型所以忽略下面错误
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import 'element-plus/dist/index.css'
// 引入svg需要的插件
import 'virtual:svg-icons-register'
// 引入自定义插件对象：注册整个项目的全局组件
import globalComponents from '@/components/index.ts'
// 引入路由
import router from './router'
// 引入仓库
import pinia from './store'
// 引入路由鉴权
import './permission'

const app = createApp(App)

app.use(Elementplus, {
  locale: zhCn,
})
app.use(globalComponents)
app.use(router)
app.use(pinia)

app.mount('#app')
