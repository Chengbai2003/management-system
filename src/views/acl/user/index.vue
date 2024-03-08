<!-- eslint-disable vue/valid-attribute-name -->
<template>
  <el-card>
    <el-form :inline="true" class="form" style="height: 50px">
      <el-form-item label="用户名：">
        <el-input placeholder="请你输入搜索的用户名字" v-model="keyword" />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          :disabled="keyword ? false : true"
          @click="search"
        >
          搜索
        </el-button>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
  <el-card style="margin: 10px 0">
    <el-button type="primary" @click="addUser">添加用户</el-button>
    <el-button
      type="danger"
      :disabled="selectUser.length ? false : true"
      @click="batchDelete"
    >
      批量删除
    </el-button>
    <!-- 表格展示用户信息 -->
    <el-table
      @selection-change="selectChange"
      style="margin: 10px 0"
      :border="true"
      :data="userArr"
    >
      <el-table-column type="selection" align="center" />
      <el-table-column type="index" label="#" align="center" />
      <el-table-column label="id" align="center" prop="id" />
      <el-table-column
        label="用户名字"
        align="center"
        prop="username"
        show-overflow-tooltip
      />
      <el-table-column
        label="用户名称"
        align="center"
        prop="name"
        show-overflow-tooltip
      />
      <el-table-column
        label="用户角色"
        align="center"
        prop="roleName"
        show-overflow-tooltip
      />
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        show-overflow-tooltip
      />
      <el-table-column
        label="更新时间"
        align="center"
        prop="updateTime"
        show-overflow-tooltip
      />
      <el-table-column label="操作" width="270px" align="center">
        <template #="{ row }">
          <el-button
            type="primary"
            size="small"
            icon="User"
            @click="setRole(row)"
          >
            分配角色
          </el-button>
          <el-button
            type="info"
            size="small"
            icon="Edit"
            @click="updateUser(row)"
          >
            编辑
          </el-button>
          <el-popconfirm
            :title="`你确定要删除${row.username}?`"
            @confirm="deleteUser(row)"
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
    <!-- 分页器 -->
    <el-pagination
      v-model:current-page="pageNo"
      v-model:page-size="pageSize"
      :page-sizes="[5, 7, 9]"
      :background="true"
      layout="prev, pager, next, jumper, ->, sizes, total"
      :total="total"
      @change="getUserList"
    />
  </el-card>
  <!-- 抽屉：添加账号、修改信息 -->
  <el-drawer v-model="drawer" :title="userInfo.id ? '修改用户' : '添加用户'">
    <el-form :model="userInfo" :rules="rules" ref="formRef">
      <el-form-item label="用户姓名" prop="username">
        <el-input placeholder="请输入用户姓名" v-model="userInfo.username" />
      </el-form-item>
      <el-form-item label="用户昵称" prop="name">
        <el-input placeholder="请输入用户昵称" v-model="userInfo.name" />
      </el-form-item>
      <el-form-item label="用户密码" prop="password" v-if="!userInfo.id">
        <el-input placeholder="请输入用户密码" v-model="userInfo.password" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div>
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="save">确定</el-button>
      </div>
    </template>
  </el-drawer>
  <!-- 抽屉：分配角色 -->
  <el-drawer v-model="drawer1" title="分配用户角色" size="30%">
    <el-form>
      <el-form-item label="用户姓名">
        <el-input v-model="userInfo.username" :disabled="true" />
      </el-form-item>
      <el-form-item label="角色列表">
        <el-checkbox
          v-model="checkAll"
          :indeterminate="isIndeterminate"
          @change="handleCheckAllChange"
        >
          全选
        </el-checkbox>
        <el-checkbox-group
          @change="handleCheckedCitiesChange"
          v-model="userRoles"
        >
          <el-checkbox v-for="role of allRoles" :key="role.id" :label="role">
            {{ role.roleName }}
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="cancel1">取消</el-button>
      <el-button type="primary" @click="updateRole">确定</el-button>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, nextTick } from 'vue'
import {
  reqUserInfo,
  reqAddOrUpdateUser,
  reqAllRole,
  reqSetRole,
  reqDeleteUser,
  reqBatchDeleteUser,
} from '@/api/acl/user'
import {
  UserResponse,
  Records,
  User,
  RoleResponse,
  Role,
  SetRoleData,
} from '@/api/acl/user/type'
import { ElMessage } from 'element-plus'
import useLayoutSettingStore from '@/store/modules/setting'

let pageNo = ref<number>(1)
let pageSize = ref<number>(5)
let total = ref<number>(0)

// 存储用户
let userArr = ref<Records>([])
// 控制增改用户抽屉 分配角色抽屉
let drawer = ref<boolean>(false)
let drawer1 = ref<boolean>(false)
// 存储用户信息
let userInfo = reactive<User>({
  username: '',
  name: '',
  password: '',
})

// 获取form表单实例
let formRef = ref<any>()

// 全部职位 和 角色已有职位
let allRoles = ref<Role[]>([])
let userRoles = ref<Role[]>([])
// 全选按钮的状态
let checkAll = ref(false)
let isIndeterminate = ref(true)

// 存储被选中的角色
let selectUser = ref<User[]>([])
// 输入框绑定值
let keyword = ref<string>('')

// 获取setting仓库
let settingStore = useLayoutSettingStore()

// 校验用户名字
const validatorUsername = (rule: any, value: any, callback: any) => {
  if (value.trim().length >= 5) {
    callback()
  } else {
    callback(new Error('用户名不能小于5位'))
  }
}
// 校验用户昵称
const validatorName = (rule: any, value: any, callback: any) => {
  if (value.trim().length >= 5) {
    callback()
  } else {
    callback(new Error('用户昵称至少5位'))
  }
}
// 校验用户密码
const validatorPassword = (rule: any, value: any, callback: any) => {
  if (value.trim().length >= 5) {
    callback()
  } else {
    callback(new Error('用户密码至少6位'))
  }
}
// 表单校验规则
let rules = {
  username: [{ required: true, trigger: 'blur', validator: validatorUsername }],
  name: [{ required: true, trigger: 'blur', validator: validatorName }],
  password: [{ required: true, trigger: 'blur', validator: validatorPassword }],
}

const getUserList = async (paper = 1) => {
  pageNo.value = paper
  let res: UserResponse = await reqUserInfo(pageNo.value, pageSize.value, '')
  if (res.code === 200) {
    total.value = res.data.total
    userArr.value = res.data.records
  }
}
onMounted(() => {
  getUserList()
})

const addUser = () => {
  drawer.value = true
  Object.assign(userInfo, { username: '', name: '', password: '' })
  delete userInfo.id
  // 清除上一次的错误信息
  nextTick(() => {
    formRef.value.clearValidate('username')
    formRef.value.clearValidate('name')
    formRef.value.clearValidate('password')
  })
}
const updateUser = (row: User) => {
  drawer.value = true
  Object.assign(userInfo, row)
  nextTick(() => {
    formRef.value.clearValidate('username')
    formRef.value.clearValidate('name')
  })
}
// 添加账号
const save = async () => {
  // 先校验 全部符合 再发
  await formRef.value.validate()
  let res: any = await reqAddOrUpdateUser(userInfo)
  if (res.code === 200) {
    drawer.value = false
    ElMessage.success(userInfo.id ? '修改成功' : '添加成功')
    // 浏览器刷新一次 —— 以防修改当前登录的账号
    window.location.reload()
  } else {
    drawer.value = false
    ElMessage.error(userInfo.id ? '修改失败' : '添加失败')
  }
}
const cancel = () => {
  drawer.value = false
}

// 获取角色列表
const setRole = async (row: User) => {
  Object.assign(userInfo, row)
  let res: RoleResponse = await reqAllRole(row.id as number)
  if (res.code === 200) {
    allRoles.value = res.data.allRolesList
    userRoles.value = res.data.assignRoles
    drawer1.value = true
  }
}

// 全选复选框change事件
const handleCheckAllChange = (val: boolean) => {
  userRoles.value = val ? allRoles.value : []
  isIndeterminate.value = false
}
// 底部复选框change事件
const handleCheckedCitiesChange = (value: string[]) => {
  const checkedCount = value.length
  checkAll.value = checkedCount === allRoles.value.length
  isIndeterminate.value =
    checkedCount > 0 && checkedCount < allRoles.value.length
}

// 修改角色
const updateRole = async () => {
  let roleParams: SetRoleData = {
    roleIdList: userRoles.value.map((item: Role) => item.id as number),
    userId: userInfo.id as number,
  }
  let res: any = await reqSetRole(roleParams)
  if (res.code === 200) {
    ElMessage.success('分配角色成功')
    getUserList(userArr.value.length > 0 ? pageNo.value : pageNo.value - 1)
  } else {
    ElMessage.error('分配角色失败')
  }
  drawer1.value = false
}
// 取消
const cancel1 = () => {
  drawer1.value = false
}

// 删除单个用户
const deleteUser = async (row: User) => {
  let res: any = await reqDeleteUser(row.id as number)
  if (res.code === 200) {
    ElMessage.success('删除成功')
    getUserList(userArr.value.length > 0 ? pageNo.value : pageNo.value - 1)
  }
}
// 获取 被选中的用户id
const selectChange = (val: any[]) => {
  selectUser.value = val
}

// 批量删除
const batchDelete = async () => {
  let idList: number[] = selectUser.value.map((item) => item.id as number)
  let res: any = await reqBatchDeleteUser(idList)
  if (res.code === 200) {
    ElMessage.success('批量删除成功')
    getUserList(userArr.value.length > 0 ? pageNo.value : pageNo.value - 1)
  }
}

// 搜索按钮
const search = async () => {
  let res: UserResponse = await reqUserInfo(
    pageNo.value,
    pageSize.value,
    keyword.value,
  )
  if (res.code === 200) {
    total.value = res.data.total
    userArr.value = res.data.records
  }
  keyword.value = ''
}

const reset = () => {
  settingStore.refresh = !settingStore.refresh
}
</script>

<style lang="scss" scoped>
.form {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
