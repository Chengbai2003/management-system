<!-- eslint-disable vue/valid-attribute-name -->
<template>
  <el-card>
    <el-table border style="margin: 10px 0" :data="skuList">
      <el-table-column label="序号" type="index" align="center" width="100px" />
      <el-table-column
        label="名称"
        show-overflow-tooltip
        width="160px"
        prop="skuName"
      />
      <el-table-column
        label="描述"
        show-overflow-tooltip
        width="160px"
        prop="skuDesc"
      />
      <el-table-column label="默认图片" width="160px">
        <template #="{ row }">
          <img :src="row.skuDefaultImg" style="width: 140px; height: 140px" />
        </template>
      </el-table-column>
      <el-table-column label="重量(g)" width="160px" prop="weight" />
      <el-table-column label="价格(元)" width="160px" prop="price" />
      <el-table-column label="操作" fixed="right" width="280px">
        <template #="{ row }">
          <el-button
            :type="row.isSale === 1 ? 'success' : 'info'"
            size="small"
            :icon="row.isSale === 1 ? 'Bottom' : 'Top'"
            @click="UpOrDown(row)"
          />
          <el-button type="primary" size="small" icon="Edit" @click="update" />
          <el-button
            type="info"
            size="small"
            icon="InfoFilled"
            @click="findSku(row)"
          />
          <el-popconfirm
            :title="`你确定要删除${row.skuName}?`"
            width="200px"
            @confirm="Delete(row)"
          >
            <template #reference>
              <el-button type="danger" size="small" icon="Delete" />
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      v-model:current-page="pageNo"
      v-model:page-size="pageSize"
      :page-sizes="[10, 20, 30, 40]"
      :background="true"
      layout="prev, pager, next, jumper, ->, sizes, total"
      :total="total"
      @change="getSkuList"
    />
    <!-- 侧边栏 -->
    <el-drawer v-model="draw" title="查看商品详情" size="35%">
      <el-row>
        <el-col :span="6">名称</el-col>
        <el-col :span="18">{{ skuInfo.skuName }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="6">描述</el-col>
        <el-col :span="18">{{ skuInfo.skuDesc }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="6">价格</el-col>
        <el-col :span="18">{{ skuInfo.price }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="6">平台属性</el-col>
        <el-col :span="18">
          <el-tag v-for="i of skuInfo.skuAttrValueList" :key="i.id">
            {{ i.valueName }}
          </el-tag>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">销售属性</el-col>
        <el-col :span="18">
          <el-tag v-for="i of skuInfo.skuSaleAttrValueList" :key="i.id">
            {{ i.saleAttrName }}-{{ i.saleAttrValueName }}
          </el-tag>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">商品图片</el-col>
        <el-col :span="18">
          <el-carousel :interval="4000" type="card" height="200px">
            <el-carousel-item v-for="i of skuInfo.skuImageList" :key="i.id">
              <img :src="i.imgUrl" style="width: 100%; height: 100%" />
            </el-carousel-item>
          </el-carousel>
        </el-col>
      </el-row>
    </el-drawer>
  </el-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  reqSkuList,
  reqUpOrDownSku,
  reqSkuInfo,
  reqDeleteSku,
} from '@/api/product/sku'
import { SkuResponse, SkuData } from '@/api/product/sku/type'
import { ElMessage } from 'element-plus'

let pageNo = ref<number>(1)
let pageSize = ref<number>(10)
let total = ref<number>(0)
let skuList = ref<SkuData[]>([])
// 侧边弹出
let draw = ref<boolean>(false)
let skuInfo = ref<any>({})

const getSkuList = async (paper = 1) => {
  pageNo.value = paper
  const result: SkuResponse = await reqSkuList(pageNo.value, pageSize.value)
  if (result.code === 200) {
    skuList.value = result.data.records
    total.value = result.data.total
  }
}
onMounted(() => {
  getSkuList()
})

const UpOrDown = async (row: SkuData) => {
  let res = await reqUpOrDownSku(row.isSale as number, row.id as number)
  if (res.code === 200) {
    ElMessage.success(row.isSale ? '下架成功' : '上架成功')
    row.isSale = row.isSale ? 0 : 1
  } else ElMessage.error(row.isSale ? '下架失败' : '上架失败')
}

const update = () => {
  ElMessage.success('程序猿们正在开发......')
}

const findSku = async (row: SkuData) => {
  draw.value = true
  // 获取已有商品详情
  let res = await reqSkuInfo(row.id as number)
  skuInfo.value = res.data
}

// 删除sku
const Delete = async (row: SkuData) => {
  let res = await reqDeleteSku(row.id as number)
  if (res.code === 200) {
    ElMessage.success('删除成功')
    getSkuList(skuList.value.length > 1 ? pageNo.value : pageNo.value - 1)
  } else ElMessage.error('系统数据，不能删除')
}
</script>

<style lang="scss" scoped>
.el-row {
  margin: 10px 0;
  .el-tag {
    margin: 5px;
  }
  .el-carousel__item h3 {
    color: #475669;
    opacity: 0.75;
    line-height: 200px;
    margin: 0;
    text-align: center;
  }

  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }

  .el-carousel__item:nth-child(2n + 1) {
    background-color: #d3dce6;
  }
}
</style>
