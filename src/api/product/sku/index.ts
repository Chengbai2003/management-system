import request from '@/utils/request'
import { SkuResponse, SkuInfoData } from './type'
enum API {
  Sku_Url = '/admin/product/list/',
  // 下架
  DownSku_Url = '/admin/product/cancelSale/',
  // 商家
  UpSku_Url = '/admin/product/onSale/',
  // 获得sku商品信息
  SkuInfo_Url = '/admin/product/getSkuInfo/',
  // 删除sku
  DeleteSku_Url = '/admin/product/deleteSku/',
}

export const reqSkuList = (page: number, limit: number) =>
  request.get<any, SkuResponse>(API.Sku_Url + `${page}/${limit}`)

export const reqUpOrDownSku = (flag: number, skuId: number) => {
  if (flag === 0) {
    return request.get<any, any>(API.UpSku_Url + skuId)
  } else {
    return request.get<any, any>(API.DownSku_Url + skuId)
  }
}

export const reqSkuInfo = (skuId: number) =>
  request.get<any, SkuInfoData>(API.SkuInfo_Url + skuId)

export const reqDeleteSku = (skuId: number) =>
  request.delete<any, any>(API.DeleteSku_Url + skuId)
