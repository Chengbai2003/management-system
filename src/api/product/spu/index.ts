import request from '@/utils/request'
import {
  Id,
  SpuResponse,
  AllTrademark,
  SpuHasImg,
  SpuHasSale,
  HasSaleAttrValue,
  SpuData,
} from './type'
enum API {
  // 已有spu
  HasSpu_Url = '/admin/product/',
  // 全部品牌数据
  AllTrademark_Url = '/admin/product/baseTrademark/getTrademarkList',
  // 某个spu下全部图片
  Image_Url = '/admin/product/spuImageList/',
  // 某个spu瞎全部已有销售属性
  SpuHasSale_Url = '/admin/product/spuSaleAttrList/',
  // 获取整个项目全部的销售属性(颜色、版本、尺码)
  AllSale_Url = '/admin/product/baseSaleAttrList/',
  // 追加新的spu
  AddSpu_Url = '/admin/product/saveSpuInfo',
  // 修改spu
  UpdateSpu_Url = '/admin/product/updateSpuInfo',
}

export const reqSpu = (page: number, limit: number, id: Id) =>
  request.get<any, SpuResponse>(
    API.HasSpu_Url + `${page}/${limit}?category3Id=${id}`,
  )
// 获取spu品牌
export const reqAllTrademark = () =>
  request.get<any, AllTrademark>(API.AllTrademark_Url)

export const reqImg = (id: number) =>
  request.get<any, SpuHasImg>(API.Image_Url + id)

export const reqHasSale = (id: Id) =>
  request.get<any, SpuHasSale>(API.SpuHasSale_Url + id)
// 获取全部销售属性
export const reqAllSale = () =>
  request.get<any, HasSaleAttrValue>(API.AllSale_Url)

export const reqAddOrUpdateSpu = (data: SpuData) => {
  if (data.id) {
    return request.post<any, any>(API.UpdateSpu_Url, data)
  } else {
    return request.post<any, any>(API.AddSpu_Url, data)
  }
}
