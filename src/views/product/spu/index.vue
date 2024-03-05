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
            <template #="{ row }">
              <el-button
                type="primary"
                size="small"
                icon="Plus"
                title="添加Sku"
                @click="addSku(row)"
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
                @click="findSku(row)"
              />
              <el-popconfirm
                :title="`你确定删除${row.spuName}?`"
                width="200px"
                @confirm="deleteSpu(row)"
              >
                <template #reference>
                  <el-button
                    type="danger"
                    size="small"
                    icon="Delete"
                    title="删除Spu"
                  />
                </template>
              </el-popconfirm>
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
      <SkuForm ref="sku" v-show="scene === 2" @changeScene="changeScene" />
      <!-- dialog对话框 展示已有sku数据 -->
      <el-dialog title="Sku列表" v-model="show">
        <el-table border :data="skuArr">
          <el-table-column label="名字" prop="skuName" />
          <el-table-column label="价格" prop="price" />
          <el-table-column label="重量" prop="weight" />
          <el-table-column label="图片">
            <template #="{ row }">
              <img
                :src="row.skuDefaultImg"
                style="height: 100px; width: 100px"
              />
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onBeforeUnmount } from 'vue'
import useCategoryStore from '@/store/modules/category'
import { reqSpu, reqSkuInfo, reqDeleteSpu } from '@/api/product/spu'
import {
  SpuResponse,
  Records,
  SpuData,
  SkuInfoData,
  SkuData,
} from '@/api/product/spu/type'
import SkuForm from './skuForm.vue'
import SpuForm from './spuForm.vue'
import { ElMessage } from 'element-plus'

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
// 子组件SkuForm实例
let sku = ref<any>()

// 存储全部Sku数据
let skuArr = ref<SkuData[]>([])
// 控制dialog显示隐藏
let show = ref<boolean>(false)

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

// 添加sku按钮回调
const addSku = (row: SpuData) => {
  scene.value = 2
  sku.value.initSku(categoryStore.c1Id, categoryStore.c2Id, row)
}

// 获取spu下sku信息
const findSku = async (row: SpuData) => {
  let res: SkuInfoData = await reqSkuInfo(row.id as number)
  if (res.code === 200) {
    skuArr.value = res.data
    show.value = true
  }
}

// 删除spu
const deleteSpu = async (row: SpuData) => {
  let res = await reqDeleteSpu(row.id as number)
  if (res.code === 200) {
    ElMessage.success('删除成功')
    getSpu(records.value.length > 1 ? pageNo.value : pageNo.value - 1)
  } else ElMessage.error('删除失败')
}

// 路由组件销毁前，清空关于分类的数据
onBeforeUnmount(() => {
  categoryStore.$reset()
})
</script>

<style lang="scss" scoped></style>
