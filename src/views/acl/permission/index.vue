<!-- eslint-disable vue/valid-attribute-name -->
<template>
  <el-table
    :data="permissionArr"
    style="width: 100%; margin-bottom: 20px"
    row-key="id"
    :border="true"
    :default-expand-all="false"
  >
    <el-table-column label="名称" prop="name" />
    <el-table-column label="权限值" prop="code" />
    <el-table-column label="修改时间" prop="updateTime" />
    <el-table-column label="操作">
      <template #="{ row }">
        <el-button
          type="primary"
          icon="User"
          size="small"
          :disabled="row.level === 4"
          @click="addPermission(row)"
        >
          添加{{ row.level === 3 ? '功能' : '菜单' }}
        </el-button>
        <el-button
          type="warning"
          icon="Edit"
          size="small"
          :disabled="row.level === 1"
          @click="updatePermission(row)"
        >
          编辑
        </el-button>
        <el-popconfirm
          :title="`你确定要删除${row.name}?`"
          @confirm="deletePermission(row.id)"
        >
          <template #reference>
            <el-button
              type="danger"
              icon="Delete"
              size="small"
              :disabled="row.level === 1"
            >
              删除
            </el-button>
          </template>
        </el-popconfirm>
      </template>
    </el-table-column>
  </el-table>
  <el-dialog
    :title="permission.id ? '修改菜单' : '添加菜单'"
    v-model="dialogVisible"
  >
    <el-form label-width="100px">
      <el-form-item label="名称">
        <el-input placeholder="请你输入名称" v-model="permission.name" />
      </el-form-item>
      <el-form-item label="权限值">
        <el-input placeholder="请你输入权限值" v-model="permission.code" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="save">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  reqAllPermission,
  reqAddOrUpdatePermission,
  reqDeletePermission,
} from '@/api/acl/permission'
import { Permission, PermissionResponse } from '@/api/acl/permission/type'
import { ElMessage } from 'element-plus'

let permissionArr = ref<Permission[]>([])

let permission = ref<Permission>({
  name: '',
  code: '',
  level: 0,
  pid: 0,
})

let dialogVisible = ref(false)

const getPermission = async () => {
  let res: PermissionResponse = await reqAllPermission()
  permissionArr.value = res.data
}

const addPermission = (row: Permission) => {
  dialogVisible.value = true
  delete permission.value.id
  Object.assign(permission.value, {
    name: '',
    code: '',
    pid: row.id,
    level: row.level + 1,
  })
}
const updatePermission = (row: Permission) => {
  dialogVisible.value = true
  Object.assign(permission.value, row)
}

const save = async () => {
  let res = await reqAddOrUpdatePermission(permission.value)
  if (res.code == 200) {
    ElMessage.success(permission.value.id ? '修改成功' : '添加成功')
    dialogVisible.value = false
    getPermission()
  }
}

const deletePermission = async (id: number) => {
  let res = await reqDeletePermission(id)
  if (res.code == 200) {
    ElMessage.success('删除成功')
    getPermission()
  }
}

onMounted(() => {
  getPermission()
})
</script>

<style lang="scss" scoped></style>
