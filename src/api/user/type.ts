// 用户相关的ts类型
// 登录接口
export interface LoginFormData {
  username: string
  password: string
}

// 定义全部接口都拥有的ts类型
export interface ResponseData {
  code: number
  message: string
  ok: boolean
}

// 登录接口返回数据类型
export interface loginResponseData extends ResponseData {
  data: string
}

// 获取用户信息返回数据类型
export interface userInfoResponseData extends ResponseData {
  data: {
    routes: string[]
    buttons: string[]
    role: string[]
    name: string
    avatar: string
  }
}
