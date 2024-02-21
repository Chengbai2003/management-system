// 使用axios的请求和响应拦截器
import axios from 'axios'
import { ElMessage } from 'element-plus'

import useUserStore from '@/store/modules/user'

const request = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API, // 基础路径上会携带api
  timeout: 5000, // 超时时间
})
// 请求拦截器
request.interceptors.request.use((config) => {
  const userStore = useUserStore()
  if (userStore.token) config.headers.token = userStore.token
  //返回配置对象
  return config
})
// 响应拦截器
request.interceptors.response.use(
  (response) => {
    // 成功回调 返回简化数据
    return response.data
  },
  (error) => {
    // 失败回调：处理http网络错误
    let message: string = ''
    const status = error.response.status
    switch (status) {
      case 401:
        message = 'token过期'
        break
      case 403:
        message = '没有权限'
        break
      case 404:
        message = '请求资源不存在'
        break
      case 500:
        message = '服务器出现错误'
        break
      default:
        message = '网络出现问题'
        break
    }
    ElMessage.error({
      type: 'error',
      message,
    })

    return Promise.reject(error)
  },
)
export default request
