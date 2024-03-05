export type Id = number | string

export interface ResponseData {
  code: number
  message: string
  ok: boolean
}

export interface SpuData {
  id?: number
  spuName: string
  tmId: Id
  description: string
  category3Id: Id
  spuSaleAttrList: null | SpuSale[]
  spuImageList: null | SpuImg[]
}

export type Records = SpuData[]

export interface SpuResponse extends ResponseData {
  data: {
    records: Records
    total: number
    size: number
    current: number
    searchCount: boolean
    pages: number
  }
}

export interface Trademark {
  id?: number
  tmName: string
  logoUrl: string
}
// 全部品牌数据
export interface AllTrademark extends ResponseData {
  data: Trademark[]
}

export interface SpuImg {
  id?: Id
  spuId?: number
  imgName?: string
  imgUrl?: string
  creatTime?: string
  updateTime?: string
  name?: string
  url?: string
}
export interface SpuHasImg extends ResponseData {
  data: SpuImg[]
}

export interface SaleValue {
  id?: number
  createTime?: null
  updateTime?: null
  spuId?: number
  baseSaleAttrId: Id
  saleAttrValueName: string
  saleAttrName?: string
  isChecked?: null
}
export type SaleValueList = SaleValue[]
export interface SpuSale {
  id?: number
  createTime?: null
  updateTime?: null
  spuId?: number
  baseSaleAttrId: Id
  saleAttrName: string
  spuSaleAttrValueList: SaleValueList
  flag?: boolean
  saleAttrValue?: string
}
export interface SpuHasSale extends ResponseData {
  data: SpuSale[]
}

// 已有全部spu返回数据
export interface HasSaleAttr {
  id: number
  name: string
}
export interface HasSaleAttrValue extends ResponseData {
  data: HasSaleAttr[]
}
