export interface ResponseData {
  code: number
  message: string
  ok: boolean
}
// 一个账号信息
export interface User {
  id?: number
  createTime?: string
  updateTime?: string
  username: string
  password: string
  name: string
  phone?: null
  roleName?: string
}

export type Records = User[]
export interface UserResponse extends ResponseData {
  data: {
    records: Records
    total: number
    size: number
    current: number
    pages: number
  }
}

// 职位信息
export interface Role {
  id?: number
  createTime?: string
  updateTime?: string
  roleName: string
  remark: null
}
export interface RoleResponse extends ResponseData {
  data: {
    assignRoles: Role[]
    allRolesList: Role[]
  }
}

// 分配角色携带参数
export interface SetRoleData {
  roleIdList: number[]
  userId: number
}
