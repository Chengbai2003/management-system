import SvgIcon from './SvgIcon/index.vue'

const allGlobalComponents = { SvgIcon }
// 对外暴露插件对象
export default {
  install(app: any) {
    // 注册项目
    Object.keys(allGlobalComponents).forEach((key: string) => {
      //@ts-expect-error 会报错 有隐式的any
      app.component(key, allGlobalComponents[key])
    })
  },
}
