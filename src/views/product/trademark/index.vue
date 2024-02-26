<template>
  <div>
    <el-card class="box-card">
      <!-- 顶部按钮 -->
      <el-button
        type="primary"
        size="default"
        icon="Plus"
        @click="addTrademark"
      >
        添加品牌
      </el-button>
      <!-- 表格组件 -->
      <el-table style="margin: 10px 0px" border :data="trademarkList">
        <el-table-column
          label="序号"
          width="80px"
          align="center"
          type="index"
        ></el-table-column>
        <el-table-column label="品牌名称">
          <template #="{ row, $index }">
            <pre>{{ row.tmName }}</pre>
          </template>
        </el-table-column>
        <el-table-column label="品牌Logo">
          <template #="{ row, $index }">
            <img :src="row.logoUrl" style="width: 100px; height: 100px" />
          </template>
        </el-table-column>
        <el-table-column label="品牌操作">
          <template #="{ row, $index }">
            <el-button
              type="primary"
              size="small"
              icon="Edit"
              @click="updataTrademark(row)"
            />
            <el-popconfirm
              :title="`您确定删除${row.tmName}?`"
              width="240px"
              icon="Delete"
              @confirm="deleteTrademark(row.id)"
            >
              <template #reference>
                <el-button type="primary" size="small" icon="Delete" />
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-model:current-page="pageNo"
        v-model:page-size="limit"
        :page-sizes="[3, 5, 7, 9]"
        :background="true"
        layout=" prev, pager, next, jumper, ->, sizes,total"
        :total="total"
        @current-change="getList"
        @size-change="getList(1)"
      />
    </el-card>
    <!-- 对话框组件 -->
    <el-dialog v-model="dialogFormVisible" :title="title" @close="cancel">
      <el-form
        style="width: 80%"
        :model="trademarkParams"
        :rules="rules"
        ref="formRef"
      >
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input
            placeholder="请您输入品牌名称"
            v-model="trademarkParams.tmName"
          ></el-input>
        </el-form-item>
        <el-form-item label="品牌Logo" label-width="100px" prop="logoUrl">
          <el-upload
            class="avatar-uploader"
            action="/api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img
              v-if="trademarkParams.logoUrl"
              :src="trademarkParams.logoUrl"
              class="avatar"
              style="width: 100%; height: 100%"
            />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" size="default" @click="cancel">
          取消
        </el-button>
        <el-button type="primary" size="default" @click="confirm">
          确定
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import {
  reqAddorUpdateTrademark,
  reqHasTrademark,
  reqDeleteTrademark,
} from '@/api/product/trademark'
import { Records, Trademark } from '@/api/product/trademark/type'

import type { UploadProps } from 'element-plus'
import { ElMessage } from 'element-plus'

let pageNo = ref<number>(1)
let limit = ref<number>(3)
let total = ref<number>(0)
let trademarkList = ref<Records>([])

let title = ref<string>('')

let trademarkParams = reactive<Trademark>({
  tmName: '',
  logoUrl: '',
})

let formRef = ref()

const getList = async (paper = 1) => {
  pageNo.value = paper
  const result = await reqHasTrademark(pageNo.value, limit.value)
  if (result.code === 200) {
    total.value = result.data.total
    trademarkList.value = result.data.records
  }
}
onMounted(() => {
  getList()
})

let dialogFormVisible = ref<boolean>(false)
const addTrademark = () => {
  title.value = '添加品牌'
  trademarkParams.tmName = trademarkParams.logoUrl = ''
  // 清除校验规则字段
  dialogFormVisible.value = true
}
const updataTrademark = (row: any) => {
  title.value = '修改品牌'
  Object.assign(trademarkParams, row)
  // trademarkParams.tmName = row.tmName
  // trademarkParams.logoUrl = row.logoUrl
  // trademarkParams.id = row.id
  dialogFormVisible.value = true
}

const cancel = () => {
  formRef.value.clearValidate('tmName')
  formRef.value.clearValidate('logoUrl')
  dialogFormVisible.value = false
}
const confirm = async () => {
  // 发送请求前 对整个表单进行校验
  await formRef.value.validate()
  let result: any = await reqAddorUpdateTrademark(trademarkParams)
  if (result.code === 200) {
    ElMessage.success((trademarkParams.id ? '修改' : '添加') + '品牌成功')
    getList(trademarkParams.id ? pageNo.value : 1)
  } else {
    ElMessage.success((trademarkParams.id ? '修改' : '添加') + '品牌失败')
  }
  delete trademarkParams.id
  dialogFormVisible.value = false
}

// 图片上传之前触发，可以约束图片的文件类型和大小
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  if (
    rawFile.type === 'image/jpeg' ||
    rawFile.type === 'image/png' ||
    rawFile.type === 'image/gif'
  ) {
    if (rawFile.size / 1024 / 1024 < 4) {
      return true
    } else {
      ElMessage.error('上传图片大小不能超过4MB!')
      return false
    }
  } else {
    ElMessage.error('上传格式必须是jpg|png|gif')
    return false
  }
}
// 上传成功
const handleAvatarSuccess: UploadProps['onSuccess'] = (
  response,
  uploadFile,
) => {
  trademarkParams.logoUrl = response.data
  // 上传成功 清除校验字段
  formRef.value.clearValidate('logoUrl')
}

// 自定义表单校验规则
const validatorTmName = (rule: any, value: any, callBack: any) => {
  if (value.trim().length >= 2) {
    callBack()
  } else {
    callBack(new Error('品牌名称不能少于2位'))
  }
}
const validatorLogoUrl = (rule: any, value: any, callBack: any) => {
  if (value) {
    callBack()
  } else {
    callBack(new Error('请上传Logo图片'))
  }
}
// 表单校验规则
const rules = {
  tmName: [{ required: true, trigger: 'blur', validator: validatorTmName }],
  logoUrl: [{ required: true, validator: validatorLogoUrl }],
}

const deleteTrademark = async (id: number) => {
  let res = await reqDeleteTrademark(id)
  if (res.code === 200) {
    ElMessage.success('删除品牌成功')
    getList(trademarkList.value.length > 1 ? pageNo.value : pageNo.value - 1)
  } else ElMessage.error(res.data)
}
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
