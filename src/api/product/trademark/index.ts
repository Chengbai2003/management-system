// 书写品牌管理模块接口
import request from '@/utils/request'
import { TrademarkResponseData, Trademark } from './type'
enum API {
  TRADEMARK_URL = '/admin/product/baseTrademark/',
  ADDTRADEMARK_URL = '/admin/product/baseTrademark/save',
  UPDATETRADEMARK_URL = '/admin/product/baseTrademark/update',
  DELETETRADEMARK_URL = '/admin/product/baseTrademark/remove/',
}

export const reqHasTrademark = (page: number, limit: number) =>
  request.get<any, TrademarkResponseData>(
    `${API.TRADEMARK_URL}${page}/${limit}`,
  )

export const reqAddorUpdateTrademark = (data: Trademark) => {
  if (data.id) {
    return request.put<any, any>(API.UPDATETRADEMARK_URL, data)
  } else {
    return request.post<any, any>(API.ADDTRADEMARK_URL, data)
  }
}

export const reqDeleteTrademark = (id: number) =>
  request.delete<any, any>(API.DELETETRADEMARK_URL + id)
