/* eslint-disable @typescript-eslint/no-unused-vars */
// 路由鉴权：某路由在什么条件下可以访问
import router from '@/router'
import setting from './setting'
//@ts-expect-error 没有ts文件声明
import nprogress from 'nprogress'
import 'nprogress/nprogress.css'
nprogress.configure({ showSpinner: false }) // 不使用加载指示器

import useUserStore from './store/modules/user'
// 不获取大仓库无法获取小仓库
import pinia from './store'
const userStore = useUserStore(pinia)

// 全局前置守卫
router.beforeEach(async (to, from, next) => {
  // 访问某个路由之前守卫 to:去哪儿 from:从哪儿来 next:路由放行函数
  nprogress.start() // 开启进度条
  const token = userStore.token
  const username = userStore.username
  // 用户登录判断
  if (token) {
    if (to.path === '/login') {
      next({ path: '/' })
    } else {
      if (username) {
        next()
      } else {
        try {
          await userStore.userInfo()
          next({ ...to, replace: true })
        } catch (error) {
          await userStore.userLogout()
          next({ path: '/login', query: { redirect: to.path } })
        }
      }
    }
  } else {
    if (to.path === '/login') {
      next()
    } else {
      next({ path: '/login', query: { redirect: to.path } })
    }
  }
})

// 全局后置守卫
router.afterEach((to, from) => {
  document.title = `${setting.title}-${to.meta.title}`
  nprogress.done() // 关闭进度条
})

// 访问路由触发进度条业务
