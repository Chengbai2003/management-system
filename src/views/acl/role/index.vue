<!-- eslint-disable vue/valid-attribute-name -->
<template>
  <el-card>
    <el-form :inline="true" class="form" style="height: 50px">
      <el-form-item label="角色名称：">
        <el-input placeholder="角色名称" v-model="keyword" />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="search"
          :disabled="keyword ? false : true"
        >
          搜索
        </el-button>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
  <el-card style="margin: 10px 0">
    <el-button type="primary" icon="Plus" @click="addRole">添加角色</el-button>
    <el-table border style="margin: 10px 0" :data="roleList">
      <el-table-column type="index" label="#" align="center" width="150px" />
      <el-table-column label="id" align="center" prop="id" />
      <el-table-column label="角色名称" align="center" prop="roleName" />
      <el-table-column
        label="创建时间"
        show-overflow-tooltip
        align="center"
        prop="createTime"
      />
      <el-table-column
        label="更新时间"
        show-overflow-tooltip
        align="center"
        prop="updateTime"
      />
      <el-table-column label="操作" width="300px" align="center">
        <template #="{ row }">
          <el-button
            type="primary"
            size="small"
            icon="User"
            @click="setPermission(row)"
          >
            分配权限
          </el-button>
          <el-button
            type="warning"
            size="small"
            icon="Edit"
            @click="updateRole(row)"
          >
            编辑
          </el-button>
          <el-popconfirm
            :title="`你确定要删除${row.roleName}?`"
            @confirm="deleteRole(row.id)"
          >
            <template #reference>
              <el-button type="danger" size="small" icon="Delete">
                删除
              </el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-model:current-page="pageNo"
      v-model:page-size="pageSize"
      :page-sizes="[5, 10, 15]"
      :background="true"
      layout="prev, pager, next, jumper, ->, sizes, total"
      :total="total"
      @change="change"
    />
  </el-card>
  <!-- 增加角色 -->
  <el-dialog
    v-model="dialogView"
    :title="roleParams.id ? '更新职位' : '添加职位'"
  >
    <el-form :model="roleParams" :rules="rules" ref="form">
      <el-form-item label="职位名称" prop="roleName">
        <el-input v-model="roleParams.roleName" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="dialogView = false">取消</el-button>
      <el-button type="primary" @click="save">确定</el-button>
    </template>
  </el-dialog>
  <!-- 分配权限 -->
  <el-drawer v-model="drawer" title="分配权限">
    <!-- 树形框架 -->
    <el-tree
      ref="tree"
      style="max-width: 600px"
      :data="menuArr"
      show-checkbox
      node-key="id"
      default-expand-all
      :default-checked-keys="selectArr"
      :props="defaultProps"
    />
    <template #footer>
      <el-button @click="drawer = false">取消</el-button>
      <el-button type="primary" @click="savePermission">确定</el-button>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import {
  reqRoleList,
  reqAddorUpdateRole,
  reqAllMenuList,
  reqSetPermission,
  reqDeleteRole,
} from '@/api/acl/role'
import { RoleResponse, Role, Menu } from '@/api/acl/role/type'
import useLayoutSettingStore from '@/store/modules/setting'
import { ElMessage } from 'element-plus'

let pageNo = ref<number>(1)
let pageSize = ref<number>(5)
let total = ref<number>(0)
let keyword = ref<string>('')

let roleList = ref<Role[]>([])
// 新增角色 和 分配权限控制
let dialogView = ref<boolean>(false)
let drawer = ref<boolean>(false)
let roleParams = ref<Role>({
  roleName: '',
})

let settingStore = useLayoutSettingStore()
let form = ref<any>()
let tree = ref<any>()

let menuArr = ref<Menu[]>([])
const defaultProps = {
  children: 'children',
  label: 'name',
}
let selectArr = ref<number[]>([])

const getRoleList = async (paper = 1, word = '') => {
  pageNo.value = paper
  let res: RoleResponse = await reqRoleList(pageNo.value, pageSize.value, word)
  if (res.code === 200) {
    roleList.value = res.data.records
    total.value = res.data.total
  }
}
// 分页器变化事件
const change = () => {
  getRoleList(pageNo.value, '')
}
const search = async () => {
  getRoleList(1, keyword.value)
  keyword.value = ''
}
const reset = () => {
  settingStore.refresh = !settingStore.refresh
}

const addRole = () => {
  roleParams.value.roleName = ''
  delete roleParams.value.id
  dialogView.value = true
  nextTick(() => {
    form.value.clearValidate('roleName')
  })
}
const updateRole = (row: Role) => {
  Object.assign(roleParams.value, row)
  dialogView.value = true
}
const save = async () => {
  await form.value.validate()
  let res: any = await reqAddorUpdateRole(roleParams.value)
  if (res.code === 200) {
    ElMessage.success(roleParams.value.id ? '修改成功' : '新增成功')
    dialogView.value = false
    getRoleList(roleParams.value.id ? pageNo.value : 1)
  }
}

const validatorRoleName = (rule: any, value: any, callBack: any) => {
  if (value.trim().length >= 2) {
    callBack()
  } else {
    callBack(new Error('职位名称至少两位'))
  }
}
//职位校验规则
const rules = {
  roleName: [{ required: true, trigger: 'blur', validator: validatorRoleName }],
}

// 分配权限
const setPermission = async (row: Role) => {
  drawer.value = true
  roleParams.value.id = row.id
  let res = await reqAllMenuList(row.id as number)
  if (res.code === 200) {
    menuArr.value = res.data
    selectArr.value = filterSelectArr(menuArr.value, [])
  }
}
const filterSelectArr = (allData: any, initArr: any) => {
  allData.forEach((item: any) => {
    if (item.select && item.level == 4) {
      initArr.push(item.id)
    }
    if (item.children && item.children.length > 0) {
      filterSelectArr(item.children, initArr)
    }
  })

  return initArr
}
// 抽屉确定按钮回调
const savePermission = async () => {
  let roleId = roleParams.value.id as number
  let permissionId = tree.value.getCheckedKeys()
  let res = await reqSetPermission(roleId, permissionId)
  if (res.code === 200) {
    ElMessage.success('分配权限成功')
    // 当前账号给自己分配权限取消了当前页面 也就访问不了 所以得刷新
    window.location.reload()
  }
  drawer.value = false
}

// 删除角色
const deleteRole = async (id: number) => {
  let res: any = await reqDeleteRole(id)
  if (res.code === 200) {
    ElMessage.success('删除成功')
    getRoleList(roleList.value.length > 1 ? pageNo.value : pageNo.value - 1)
  }
}

onMounted(() => {
  getRoleList()
})
</script>

<style lang="scss" scoped>
.form {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
