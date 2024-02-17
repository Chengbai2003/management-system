import { createApp } from 'vue'
import Elementplus from 'element-plus'
//@ts-expect-error 是js文件没有ts类型所以忽略下面错误
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import 'element-plus/dist/index.css'
import App from './App.vue'

const app = createApp(App)

app.use(Elementplus, {
  locale: zhCn,
})

app.mount('#app')
