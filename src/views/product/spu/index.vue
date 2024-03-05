<!-- eslint-disable vue/valid-attribute-name -->
<template>
  <div>
    <Category :scene="scene" />
    <el-card style="margin: 10px 0">
      <div v-show="scene === 0">
        <el-button
          type="primary"
          icon="Plus"
          :disabled="categoryStore.c3Id ? false : true"
          @click="addSpu()"
        >
          添加Spu
        </el-button>
        <el-table style="margin: 10px 0" :border="true" :data="records">
          <el-table-column
            label="序号"
            width="100px"
            :align="'center'"
            type="index"
          />
          <el-table-column label="Spu名称" prop="spuName" />
          <el-table-column
            label="Spu描述"
            prop="description"
            show-overflow-tooltip
          />
          <el-table-column label="操作">
            <template #="{ row, $index }">
              <el-button
                type="primary"
                size="small"
                icon="Plus"
                title="添加Sku"
              />
              <el-button
                type="info"
                size="small"
                icon="Edit"
                title="修改spu"
                @click="updateSpu(row)"
              />
              <el-button
                type="warning"
                size="small"
                icon="View"
                title="查看Sku"
              />
              <el-button
                type="danger"
                size="small"
                icon="Delete"
                title="删除Spu"
              />
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          v-show="records.length > 0"
          v-model:current-page="pageNo"
          v-model:page-size="pageSize"
          :page-sizes="[3, 5, 7, 9]"
          :background="true"
          layout="prev, pager, next, jumper,->, sizes, total"
          :total="total"
          @change="getSpu"
        />
      </div>
      <!-- 添加 or 修改 spu -->
      <SpuForm ref="spu" v-show="scene === 1" @changeScene="changeScene" />
      <!-- 添加 sku -->
      <SkuForm v-show="scene === 2" />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import useCategoryStore from '@/store/modules/category'
import { reqSpu } from '@/api/product/spu'
import { SpuResponse, Records, SpuData } from '@/api/product/spu/type'
import SkuForm from './skuForm.vue'
import SpuForm from './spuForm.vue'

let categoryStore = useCategoryStore()
// 切换展示
let scene = ref<number>(0)
// 页码相关
let pageNo = ref<number>(1)
let pageSize = ref<number>(3)
let total = ref<number>(0)

let records = ref<Records>([])
// 子组件SpuForm实例
let spu = ref<any>()

watch(
  () => categoryStore.c3Id,
  (newVal) => {
    if (newVal !== '') {
      getSpu()
    } else {
      records.value = []
    }
  },
)
const getSpu = async (paper = 1) => {
  pageNo.value = paper
  let res: SpuResponse = await reqSpu(
    pageNo.value,
    pageSize.value,
    categoryStore.c3Id,
  )
  if (res.code === 200) {
    records.value = res.data.records
    total.value = res.data.total
  }
}

const changeScene = (obj: any) => {
  scene.value = obj.scene
  // 切换回来获取Spu true代表更新 false代表添加
  if (obj.flag) {
    getSpu(pageNo.value)
  } else {
    getSpu()
  }
}

const addSpu = () => {
  scene.value = 1
  spu.value.initAddSpu(categoryStore.c3Id)
}
const updateSpu = (row: SpuData) => {
  scene.value = 1
  spu.value.initSpuData(row)
}
</script>

<style lang="scss" scoped></style>
