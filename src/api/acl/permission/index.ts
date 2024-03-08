import request from '@/utils/request'
import { PermissionResponse } from './type'

enum API {
  // 获取全部菜单
  AllPermission_Url = '/admin/acl/permission',
  // 新增菜单
  AddPermission_Url = '/admin/acl/permission/save',
  // 修改菜单
  UpdatePermission_Url = '/admin/acl/permission/update',
  // 删除菜单
  DeletePermission_Url = '/admin/acl/permission/remove/',
}

export const reqAllPermission = () =>
  request.get<any, PermissionResponse>(API.AllPermission_Url)

export const reqAddOrUpdatePermission = (data: any) => {
  if (data.id) return request.put<any, any>(API.UpdatePermission_Url, data)
  return request.post<any, any>(API.AddPermission_Url, data)
}

export const reqDeletePermission = (id: number) =>
  request.delete<any, any>(API.DeletePermission_Url + id)
