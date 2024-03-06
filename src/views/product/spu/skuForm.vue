<!-- eslint-disable vue/valid-attribute-name -->
<template>
  <el-form label-width="100px">
    <el-form-item label="Sku名称">
      <el-input placeholder="sku名称" v-model="skuParams.skuName" />
    </el-form-item>
    <el-form-item label="价格(元)">
      <el-input
        type="number"
        placeholder="价格(元)"
        v-model="skuParams.price"
      />
    </el-form-item>
    <el-form-item label="重量(克)">
      <el-input placeholder="重量(克)" v-model="skuParams.weight" />
    </el-form-item>
    <el-form-item label="Sku描述">
      <el-input
        type="textarea"
        placeholder="sku描述"
        v-model="skuParams.skuDesc"
      />
    </el-form-item>
    <el-form-item label="平台属性">
      <el-form :inline="true">
        <el-form-item v-for="i of attrArr" :key="i.id" :label="i.attrName">
          <el-select style="width: 200px" v-model="i.attrIdAndValueId">
            <el-option
              v-for="attrValue of i.attrValueList"
              :key="attrValue.id"
              :label="attrValue.valueName"
              :value="`${i.id}:${attrValue.id}`"
            />
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="销售属性">
      <el-form :inline="true">
        <el-form-item v-for="i of saleArr" :key="i.id" :label="i.saleAttrName">
          <el-select style="width: 200px" v-model="i.saleAndValueId">
            <el-option
              v-for="saleAttrValue of i.spuSaleAttrValueList"
              :key="saleAttrValue.id"
              :label="saleAttrValue.saleAttrValueName"
              :value="`${i.id}:${saleAttrValue.id}`"
            />
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="图片名称">
      <el-table border :data="imgArr" ref="table">
        <el-table-column type="selection" width="100px" align="center" />
        <el-table-column label="图片">
          <template #="{ row }">
            <img :src="row.imgUrl" alt="" style="width: 100px; height: 100px" />
          </template>
        </el-table-column>
        <el-table-column label="名称" prop="imgName"></el-table-column>
        <el-table-column label="操作">
          <template #="{ row }">
            <el-button type="warning" size="small" @click="handler(row)">
              设置默认
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="save">保存</el-button>
      <el-button type="primary" @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { reqAttr } from '@/api/product/attr'
import { reqImg, reqHasSale, reqAddSku } from '@/api/product/spu'
import { Id, SpuData, SkuData } from '@/api/product/spu/type'
import { ElMessage } from 'element-plus'
//自定义 事件方法
let $emit = defineEmits(['changeScene'])
// 平台属性 销售属性 照片墙
let attrArr = ref<any>([])
let saleArr = ref<any>([])
let imgArr = ref<any>([])
// 收集sku参数
let skuParams = reactive<SkuData>({
  category3Id: '',
  spuId: '',
  tmId: '',
  skuName: '',
  price: '',
  weight: '',
  skuDesc: '',
  skuDefaultImg: '',
  skuAttrValueList: [],
  skuSaleAttrValueList: [],
})
// 获取table组件实例
let table = ref<any>()

const initSku = async (c1Id: Id, c2Id: Id, row: SpuData) => {
  //清空数据
  Object.assign(skuParams, {
    category3Id: '',
    spuId: '',
    tmId: '',
    skuName: '',
    price: '',
    weight: '',
    skuDesc: '',
    skuDefaultImg: '',
    skuAttrValueList: [],
    skuSaleAttrValueList: [],
  })
  // 收集数据
  skuParams.category3Id = row.category3Id
  skuParams.spuId = row.id as number
  skuParams.tmId = row.tmId
  // 获取平台属性 销售属性 照片墙
  let res1 = await reqAttr(c1Id, c2Id, row.category3Id as number)
  let res2 = await reqHasSale(row.id as number)
  let res3 = await reqImg(row.id as number)

  attrArr.value = res1.data
  saleArr.value = res2.data
  imgArr.value = res3.data
}

const handler = (row: any) => {
  // 复选框选中 先全部取消选择
  table.value.clearSelection()
  table.value.toggleRowSelection(row, true)
  skuParams.skuDefaultImg = row.imgUrl
}

// 保存和取消按钮
const save = async () => {
  // 整理参数 平台属性 和 销售属性
  skuParams.skuAttrValueList = attrArr.value.reduce((prev: any, item: any) => {
    if (item.attrIdAndValueId) {
      let [attrId, ValueId] = item.attrIdAndValueId.split(':')
      prev.push({ attrId, ValueId })
    }
    return prev
  }, [])

  skuParams.skuSaleAttrValueList = saleArr.value.reduce(
    (prev: any, item: any) => {
      if (item.saleAndValueId) {
        let [saleAttrId, saleAttrValueId] = item.saleAndValueId.split(':')
        prev.push({ saleAttrId, saleAttrValueId })
      }
      return prev
    },
    [],
  )

  // 发送请求
  let res = await reqAddSku(skuParams)
  if (res.code === 200) {
    ElMessage.success('添加sku成功')
    $emit('changeScene', { scene: 0, flag: false })
  } else {
    ElMessage.error('添加sku失败')
  }
}
const cancel = () => {
  $emit('changeScene', { scene: 0, flag: false })
}
defineExpose({ initSku })
</script>

<style lnag="scss" scoped></style>
