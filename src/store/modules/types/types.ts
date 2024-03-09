import type { RouteRecordRaw } from 'vue-router'
import { CategoryObj } from '@/api/product/attr/type'
// 小仓库数据state类型
export interface UserState {
  token: string | null
  menuRoutes: RouteRecordRaw[]
  username: string
  avatar: string
  buttons: string[]
}

export interface CategoryState {
  c1Id: number | string
  list1: CategoryObj[]
  c2Id: number | string
  list2: CategoryObj[]
  c3Id: number | string
  list3: CategoryObj[]
}
