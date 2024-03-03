// 分类相关数据类型

export interface ResponseData {
  code: number
  message: string
  ok: boolean
}

export interface CategoryObj {
  id: number | string
  name: string
  category1Id?: number
  category2Id?: number
}

export interface CategoryResponse extends ResponseData {
  data: CategoryObj[]
}

export type Id = number | string

// 属性与属性值ts类型

export interface AttrValue {
  id?: number
  valueName: string
  attrId?: number
  flag?: boolean
}

export interface Attr {
  id?: number
  attrName: string
  categoryId: Id
  categoryLevel: number
  attrValueList: AttrValue[]
}
export interface AttrResponse extends ResponseData {
  data: Attr[]
}
