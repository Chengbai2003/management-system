// 商品分类全局组件的小仓库
import { defineStore } from 'pinia'
import { reqC1, reqC2, reqC3 } from '@/api/product/attr'
import type { CategoryResponse } from '@/api/product/attr/type'
import type { CategoryState } from './types/types'
const useCategoryStore = defineStore('CategoryStore', {
  state: (): CategoryState => {
    return {
      list1: [],
      c1Id: '',
      list2: [],
      c2Id: '',
      list3: [],
      c3Id: '',
    }
  },
  actions: {
    async getC1() {
      const res: CategoryResponse = await reqC1()
      res.code === 200 && (this.list1 = res.data)
    },
    async getC2() {
      const res: CategoryResponse = await reqC2(this.c1Id)
      res.code === 200 && (this.list2 = res.data)
    },
    async getC3() {
      const res: CategoryResponse = await reqC3(this.c2Id)
      res.code === 200 && (this.list3 = res.data)
    },
  },
  getters: {},
})

export default useCategoryStore
