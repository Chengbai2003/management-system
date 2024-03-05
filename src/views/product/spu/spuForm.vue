<!-- eslint-disable vue/valid-attribute-name -->
<template>
  <el-form label-width="100px">
    <el-form-item label="Spu名称">
      <el-input placeholder="请您输入spu名称" v-model="SpuParams.spuName" />
    </el-form-item>
    <el-form-item label="Spu品牌">
      <el-select
        placeholder="请您选择spu品牌"
        style="width: 200px"
        v-model="SpuParams.tmId"
      >
        <el-option
          v-for="item of allTrademark"
          :label="item.tmName"
          :key="item.id"
          :value="item.id"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="Spu描述">
      <el-input
        type="textarea"
        placeholder="请您输入描述"
        v-model="SpuParams.description"
      ></el-input>
    </el-form-item>
    <el-form-item label="Spu照片">
      <el-upload
        v-model:file-list="imgList"
        action="/api/admin/product/fileUpload"
        list-type="picture-card"
        :on-preview="handlePictureCardPreview"
        :before-upload="handleUpload"
      >
        <el-icon>
          <Plus />
        </el-icon>
      </el-upload>
      <el-dialog v-model="dialogVisible">
        <img
          w-full
          :src="dialogImgUrl"
          alt="Preview Image"
          style="width: 100%; height: 100%"
        />
      </el-dialog>
    </el-form-item>
    <el-form-item label="Spu销售属性">
      <!-- 展示销售属性下拉菜单 -->
      <el-select
        v-model="saleIdAndName"
        :placeholder="
          unSelectedSaleAttr.length
            ? `还未选择${unSelectedSaleAttr.length}个`
            : '无'
        "
        style="width: 200px"
      >
        <el-option
          v-for="item of unSelectedSaleAttr"
          :key="item.name"
          :label="item.name"
          :value="`${item.id}:${item.name}`"
        />
      </el-select>
      <el-button
        @click="addSaleAttr"
        :disabled="saleIdAndName ? false : true"
        type="primary"
        icon="Plus"
        style="margin-left: 10px"
      >
        添加属性
      </el-button>
      <!-- 展示销售属性与属性值 -->
      <el-table border style="margin: 10px 0" :data="saleAttr">
        <el-table-column
          label="序号"
          type="index"
          :align="'center'"
          width="100px"
        />
        <el-table-column label="属性名" width="150px" prop="saleAttrName" />
        <el-table-column label="属性值">
          <!-- row 是当前spu已有属性对象 -->
          <template #="{ row }">
            <el-tag
              v-for="(item, index) in row.spuSaleAttrValueList"
              @close="row.spuSaleAttrValueList.splice(index, 1)"
              :key="item.id"
              style="margin: 0 5px"
              closable
            >
              {{ item.saleAttrValueName }}
            </el-tag>
            <el-input
              v-if="row.flag"
              v-model="row.saleAttrValue"
              @blur="toLook(row)"
              placeholder="请你输入属性值"
              size="small"
              style="width: 100px"
            />
            <el-button
              v-else
              type="success"
              size="small"
              icon="Plus"
              @click="toEdit(row)"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100px">
          <template #="{ $index }">
            <el-button
              type="danger"
              size="small"
              icon="Delete"
              @click="saleAttr.splice($index, 1)"
            />
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="save">保存</el-button>
      <el-button @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  SpuData,
  AllTrademark,
  SpuHasImg,
  SpuHasSale,
  HasSaleAttrValue,
  Trademark,
  SpuImg,
  SpuSale,
  HasSaleAttr,
  SaleValue,
} from '@/api/product/spu/type'
import {
  reqAllTrademark,
  reqImg,
  reqHasSale,
  reqAllSale,
  reqAddOrUpdateSpu,
} from '@/api/product/spu'
import { ElMessage } from 'element-plus'
import { Id } from '@/api/product/attr/type'

let $emit = defineEmits(['changeScene'])

const cancel = () => {
  // 切换场景
  $emit('changeScene', { scene: 0, flag: true })
}

let allTrademark = ref<Trademark[]>([])
let imgList = ref<SpuImg[]>([])
let saleAttr = ref<SpuSale[]>([])
let allSaleAttr = ref<HasSaleAttr[]>([])
// 存储已有spu对象
let SpuParams = ref<SpuData>({
  category3Id: '',
  spuName: '',
  description: '',
  tmId: '',
  spuImageList: [],
  spuSaleAttrList: [],
})
// 控制展示图片的对话框
let dialogVisible = ref<boolean>(false)
let dialogImgUrl = ref<string>('')
// 收集还未选择的销售属性的id与名字
let saleIdAndName = ref<string>('')

// 父组件触发来传递信息
const initSpuData = async (spu: SpuData) => {
  SpuParams.value = spu
  // spu是父组件传递的已有spu对象(不完整)
  // 品牌 照片墙 全部属性值 属性名称
  let res1: AllTrademark = await reqAllTrademark()
  let res2: SpuHasImg = await reqImg(spu.id as number)
  let res3: SpuHasSale = await reqHasSale(spu.id as number)
  let res4: HasSaleAttrValue = await reqAllSale()

  allTrademark.value = res1.data
  imgList.value = res2.data.map((item) => {
    return {
      name: item.imgName,
      url: item.imgUrl,
    }
  })
  saleAttr.value = res3.data
  allSaleAttr.value = res4.data
  // console.log(SpuParams.value)
}
// 照片墙点击预览触发的钩子
const handlePictureCardPreview = (file: any) => {
  dialogImgUrl.value = file.url
  dialogVisible.value = true
}
// 照片墙上传文件之前触发的钩子
const handleUpload = (file: any) => {
  if (
    file.type === 'image/jpeg' ||
    file.type === 'image/png' ||
    file.type === 'image/gif'
  ) {
    if (file.size / 1024 / 1024 < 3) {
      return true
    } else {
      ElMessage.warning('图片大小不能超过3M')
      return false
    }
  } else {
    ElMessage.warning('上传文件类型必须是PNG|JPG|GIF')
    return false
  }
}

// 计算出当前spu还未拥有的销售属性
let unSelectedSaleAttr = computed(() => {
  let unSelectArr = allSaleAttr.value.filter((item) => {
    return saleAttr.value.every((item1) => item1.saleAttrName !== item.name)
  })
  return unSelectArr
})
// 添加销售属性的方法
const addSaleAttr = () => {
  const [baseSaleAttrId, saleAttrName] = saleIdAndName.value.split(':')
  let newSaleAttr: SpuSale = {
    baseSaleAttrId,
    saleAttrName,
    spuSaleAttrValueList: [],
  }
  saleAttr.value.push(newSaleAttr)
  saleIdAndName.value = ''
}

// 属性值按钮点击事件
const toEdit = (row: SpuSale) => {
  row.flag = true
  row.saleAttrValue = ''
}
// 输入框失去焦点的回调
const toLook = (row: SpuSale) => {
  // 收集到的id和属性值的名字
  const { baseSaleAttrId, saleAttrValue } = row
  let newSaleAttrValue: SaleValue = {
    baseSaleAttrId,
    saleAttrValueName: saleAttrValue as string,
  }
  // 非法情况判断
  if ((saleAttrValue as string).trim() === '') {
    ElMessage.error('属性值为空')
    return
  }
  let repeat = row.spuSaleAttrValueList.some(
    (item) => item.saleAttrValueName === saleAttrValue,
  )
  if (repeat) {
    ElMessage.error('属性值重复')
    return
  }
  row.spuSaleAttrValueList.push(newSaleAttrValue)
  row.flag = false
}

const save = async () => {
  // 整理参数
  SpuParams.value.spuImageList = imgList.value.map((item: any) => {
    return {
      imgName: item.name,
      imgUrl: (item.response && item.response.data) || item.url,
    }
  })
  SpuParams.value.spuSaleAttrList = saleAttr.value

  let res = await reqAddOrUpdateSpu(SpuParams.value)
  if (res.code === 200) {
    ElMessage.success(SpuParams.value.id ? '更新成功' : '添加成功')
    // 通知父组件切换场景 true代表更新 false代表添加
    $emit('changeScene', { scene: 0, flag: SpuParams.value.id ? true : false })
  } else {
    ElMessage.error(res.data)
  }
}

const initAddSpu = async (c3Id: Id) => {
  //清空数据
  Object.assign(SpuParams.value, {
    category3Id: '',
    spuName: '',
    description: '',
    tmId: '',
    spuImageList: [],
    spuSaleAttrList: [],
  })
  delete SpuParams.value.id
  imgList.value = []
  saleAttr.value = []
  saleIdAndName.value = ''
  // 获取数据
  let res1: AllTrademark = await reqAllTrademark()
  let res2: HasSaleAttrValue = await reqAllSale()
  allTrademark.value = res1.data
  allSaleAttr.value = res2.data
  SpuParams.value.category3Id = c3Id
}

//对外暴露
defineExpose({ initSpuData, initAddSpu })
</script>

<style lnag="scss" scoped></style>
