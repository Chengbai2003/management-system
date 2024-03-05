<template>
  <div>
    <Category :scene="scene"></Category>
    <el-card style="margin: 10px 0">
      <div v-show="scene === 0">
        <el-button
          type="primary"
          size="default"
          icon="Plus"
          :disabled="categoryStore.c3Id ? false : true"
          @click="addAttr"
        >
          添加属性
        </el-button>
        <el-table :border="true" style="margin: 10px 0" :data="attrArr">
          <el-table-column
            label="序号"
            type="index"
            :align="'center'"
            width="80px"
          ></el-table-column>
          <el-table-column label="属性名称" width="150px" prop="attrName" />
          <el-table-column label="属性值">
            <template #default="{ row }">
              <el-tag
                style="margin: 5px"
                v-for="item of row.attrValueList"
                :key="item.id"
              >
                {{ item.valueName }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150px" :align="'center'">
            <template #="{ row }">
              <el-button
                type="warning"
                size="small"
                icon="Edit"
                @click="editAttr(row)"
              />
              <el-popconfirm
                :title="`您确定删除${row.attrName}?`"
                @confirm="deleteAttr(row.id)"
              >
                <template #reference>
                  <el-button type="danger" size="small" icon="Delete" />
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-show="scene === 1">
        <!-- 展示添加和修改得结构 -->
        <el-form :inline="true">
          <el-form-item label="属性名称">
            <el-input
              placeholder="请你输入属性名称"
              v-model="attrParams.attrName"
            ></el-input>
          </el-form-item>
        </el-form>
        <el-button
          :disabled="attrParams.attrName ? false : true"
          type="primary"
          icon="Plus"
          @click="addAttrValue"
        >
          添加属性
        </el-button>
        <el-button @click="cancel">取消</el-button>
        <el-table
          :border="true"
          style="margin: 10px 0"
          :data="attrParams.attrValueList"
        >
          <el-table-column
            label="序号"
            width="100px"
            type="index"
            :align="'center'"
          ></el-table-column>
          <el-table-column label="属性值名称">
            <template #="{ row, $index }">
              <el-input
                :ref="(vc: any) => (inputArr[$index] = vc)"
                v-if="row.flag"
                @blur="toLook(row, $index)"
                placeholder="请你输入属性值名称"
                v-model="row.valueName"
              ></el-input>
              <div v-else @click="toEdit(row, $index)">{{ row.valueName }}</div>
            </template>
          </el-table-column>
          <el-table-column label="属性值操作">
            <template #="{ row, $index }">
              <el-button
                type="warning"
                size="small"
                icon="Delete"
                @click="attrParams.attrValueList.splice($index, 1)"
              />
            </template>
          </el-table-column>
        </el-table>
        <el-button
          type="primary"
          icon="Plus"
          @click="save"
          :disabled="
            (attrParams.attrValueList.length > 0 ? false : true) ||
            attrParams.attrValueList.some((item) => item.valueName === '')
          "
        >
          保存
        </el-button>
        <el-button @click="cancel">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { nextTick, reactive, ref, watch, onBeforeUnmount } from 'vue'
import { reqAttr, reqAddOrUpdateAttr, reqDeleteAttr } from '@/api/product/attr'
import { Attr, type AttrResponse, AttrValue } from '@/api/product/attr/type'
import useCategoryStore from '@/store/modules/category'
import { ElMessage } from 'element-plus'

let categoryStore = useCategoryStore()
let attrArr = ref<Attr[]>([])

let scene = ref<number>(0)
//收集新增属性对象
let attrParams = reactive<Attr>({
  attrName: '',
  attrValueList: [],
  categoryId: '',
  categoryLevel: 3,
})

let inputArr = ref<any>([])

watch(
  () => categoryStore.c3Id,
  (newVal) => {
    attrArr.value = []
    if (newVal) {
      getAttr()
    }
  },
)

const getAttr = async () => {
  const { c1Id, c2Id, c3Id } = categoryStore
  let res: AttrResponse = await reqAttr(c1Id, c2Id, c3Id)
  res.code === 200 && (attrArr.value = res.data)
}

const addAttr = () => {
  scene.value = 1
  Object.assign(attrParams, {
    attrName: '',
    attrValueList: [],
    categoryId: categoryStore.c3Id,
    categoryLevel: 3,
  })
}
// 编辑属性
const editAttr = (row: any) => {
  scene.value = 1
  Object.assign(attrParams, JSON.parse(JSON.stringify(row)))
}
// 删除属性
const deleteAttr = async (id: number) => {
  let res = await reqDeleteAttr(id)
  if (res.code === 200) {
    ElMessage.success('删除成功')
    getAttr()
  } else {
    ElMessage.error('删除失败')
  }
}
const cancel = () => {
  scene.value = 0
}

const addAttrValue = () => {
  attrParams.attrValueList.push({
    valueName: '',
    flag: true, //控制每个属性值编辑和切换模式的切换
  })
  // 获取最后el-input组件聚焦
  nextTick(() => {
    inputArr.value[attrParams.attrValueList.length - 1].focus()
  })
}
const save = async () => {
  let res = await reqAddOrUpdateAttr(attrParams)
  if (res.code === 200) {
    scene.value = 0
    ElMessage.success(attrParams.id ? '修改成功' : '添加成功')
    getAttr()
  } else ElMessage.error(attrParams.id ? '修改失败' : '添加失败')
}

const toLook = (row: AttrValue, $index: number) => {
  if (row.valueName.trim() === '') {
    attrParams.attrValueList.splice($index, 1)
    ElMessage.warning('属性值不能为空')
    return
  }

  let repeat = attrParams.attrValueList.find((item) => {
    if (item !== row) {
      return item.valueName === row.valueName
    }
  })
  if (repeat) {
    attrParams.attrValueList.splice($index, 1)
    ElMessage.warning('属性值不能重复')
    return
  }
  row.flag = false
}
const toEdit = (row: AttrValue, $index: number) => {
  row.flag = true
  // 响应式数据发生变化，获取更新后的dom实例
  nextTick(() => {
    inputArr.value[$index].focus()
  })
}
// 路由组件销毁时 清空对应仓库数据
onBeforeUnmount(() => {
  categoryStore.$reset()
})
</script>

<style lang="scss" scoped></style>
