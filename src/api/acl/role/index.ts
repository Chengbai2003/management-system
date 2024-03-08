import request from '@/utils/request'
import { RoleResponse, Role, MenuResponse } from './type'

enum API {
  // 获取全部角色
  AllRole_Url = '/admin/acl/role/',
  // 新增角色
  AddRole_Url = '/admin/acl/role/save',
  // 更新角色
  UpdateRole_Url = '/admin/acl/role/update',
  // 根据获取权限菜单
  AllPermission_Url = '/admin/acl/permission/toAssign/',
  // 给角色分配权限
  SetPermission_Url = '/admin/acl/permission/doAssign',
  // 删除角色
  DeleteRole_Url = '/admin/acl/role/remove/',
}

export const reqRoleList = (page: number, limit: number, roleName: string) =>
  request.get<any, RoleResponse>(
    API.AllRole_Url + `${page}/${limit}?roleName=${roleName}`,
  )

export const reqAddorUpdateRole = (data: Role) => {
  if (data.id) return request.put<any, any>(API.UpdateRole_Url, data)
  else return request.post<any, any>(API.AddRole_Url, data)
}

export const reqAllMenuList = (id: number) =>
  request.get<any, MenuResponse>(API.AllPermission_Url + id)

export const reqSetPermission = (roleId: number, permissionId: number[]) =>
  request.post<any, any>(
    API.SetPermission_Url + `?roleId=${roleId}&permissionId=${permissionId}`,
  )

export const reqDeleteRole = (id: number) =>
  request.delete<any, any>(API.DeleteRole_Url + id)
