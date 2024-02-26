//
export interface ResponseData {
  code: number
  message: string
  ok: boolean
}

export interface Trademark {
  id?: number
  tmName: string
  logoUrl: string
}

// 包含所有品牌的数组
export type Records = Trademark[]

export interface TrademarkResponseData extends ResponseData {
  data: {
    records: Records
    total: number
    size: number
    current: number
    searchCount: boolean
    pages: number
  }
}
