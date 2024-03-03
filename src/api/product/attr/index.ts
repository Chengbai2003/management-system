// 属性相关api接口
import request from '@/utils/request'
import type { CategoryResponse, Id, AttrResponse, Attr } from './type'

enum API {
  Category1_Url = '/admin/product/getCategory1',
  Category2_Url = '/admin/product/getCategory2/',
  Category3_Url = '/admin/product/getCategory3/',
  Attr_Url = '/admin/product/attrInfoList/',
  // 添加 or 修改属性
  AddOrUpdateAttr_Url = '/admin/product/saveAttrInfo',
  // 删除
  DeleteAttr_Url = '/admin/product/deleteAttr/',
}

export const reqC1 = () => request.get<any, CategoryResponse>(API.Category1_Url)
export const reqC2 = (id1: Id) =>
  request.get<any, CategoryResponse>(API.Category2_Url + id1)
export const reqC3 = (id2: Id) =>
  request.get<any, CategoryResponse>(API.Category3_Url + id2)
export const reqAttr = (id1: Id, id2: Id, id3: Id) =>
  request.get<any, AttrResponse>(API.Attr_Url + `${id1}/${id2}/${id3}`)

export const reqAddOrUpdateAttr = (data: Attr) =>
  request.post<any, any>(API.AddOrUpdateAttr_Url, data)

export const reqDeleteAttr = (id: Id) =>
  request.delete<any, any>(API.DeleteAttr_Url + id)
