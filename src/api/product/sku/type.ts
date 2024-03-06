export interface ResponseData {
  code: number
  message: string
  ok: boolean
}

export type Id = number | string
export interface Attr {
  attrId: Id
  ValueId: Id
}
export interface SaleArr {
  saleAttrId: Id
  saleAttrValueId: Id
}

export interface SkuData {
  category3Id?: Id
  spuId?: Id
  tmId?: Id
  skuName?: string
  price?: number | string
  weight?: number | string
  skuDesc?: string
  skuAttrValueList?: Attr[]
  skuSaleAttrValueList?: SaleArr[]
  skuDefaultImg?: string
  isSale?: number
  id?: number
}
// 获取sku返回数据
export interface SkuResponse extends ResponseData {
  data: {
    records: SkuData[]
    total: number
    size: number
    current: number
    order: []
    optimizeCountSql: boolean
    hitCount: boolean
    countId: null
    maxLimit: null
    searchCount: boolean
    pages: number
  }
}

// 获取sku商品详情
export interface SkuInfoData extends ResponseData {
  data: SkuData
}
