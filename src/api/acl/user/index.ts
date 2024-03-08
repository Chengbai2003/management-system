import request from '@/utils/request'
import { UserResponse, User, RoleResponse, SetRoleData } from './type'

enum API {
  // 获取用户分页列表
  AllUser_Url = '/admin/acl/user/',
  // 新增用户
  AddUser_Url = '/admin/acl/user/save',
  // 修改用户
  UpdateUser_Url = '/admin/acl/user/update',
  // 获取全部职位 以及 当前账号职位
  AllRole_Url = '/admin/acl/user/toAssign/',
  // 给用户分配角色
  SetRole_Url = '/admin/acl/user/doAssignRole',
  // 单个删除用户
  DeleteUser_Url = '/admin/acl/user/remove/',
  // 批量删除用户
  BatchDeleteUser_Url = '/admin/acl/user/batchRemove',
}

export const reqUserInfo = (page: number, limit: number, username?: string) =>
  request.get<any, UserResponse>(
    API.AllUser_Url + `${page}/${limit}?username=${username}`,
  )

export const reqAddOrUpdateUser = (user: User) => {
  if (user.id) {
    return request.put<any, any>(API.UpdateUser_Url, user)
  } else {
    return request.post<any, any>(API.AddUser_Url, user)
  }
}

export const reqAllRole = (userId: number) =>
  request.get<any, RoleResponse>(API.AllRole_Url + userId)

export const reqSetRole = (data: SetRoleData) =>
  request.post<any, any>(API.SetRole_Url, data)

export const reqDeleteUser = (id: number) =>
  request.delete<any, any>(API.DeleteUser_Url + id)

export const reqBatchDeleteUser = (idList: number[]) =>
  request.delete<any, any>(API.BatchDeleteUser_Url, { data: idList })
