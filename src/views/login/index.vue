<template>
  <div class="login_container">
    <el-row>
      <el-col :span="12" :xs="0"></el-col>
      <el-col :span="12" :xs="24">
        <el-form
          class="login_form"
          :model="loginFrom"
          :rules="rules"
          ref="loginForms"
        >
          <h1>Hello</h1>
          <h2>欢迎来到后台管理系统</h2>
          <el-form-item prop="username">
            <el-input
              :prefix-icon="User"
              v-model="loginFrom.username"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              type="password"
              :prefix-icon="Lock"
              v-model="loginFrom.password"
              show-password
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              class="login_btn"
              type="primary"
              size="default"
              @click="login"
              :loading="loading"
            >
              登录
            </el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { User, Lock } from '@element-plus/icons-vue'
import { reactive, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElNotification } from 'element-plus'
//引入用户相关仓库
import useUserStore from '@/store/modules/user'
import { getTime } from '@/utils/time'
let userStore = useUserStore()
//获取表单元素
let loginForms = ref(null)
//获取路由器
let $router = useRouter()
let $route = useRoute()
//定义变量控制按钮加载效果
let loading = ref<any>(false)
//收集表单数据
let loginFrom = reactive({ username: 'admin', password: '111111' })

const login = async () => {
  // 表单项全部通过再发请求
  await (loginForms.value as unknown as HTMLFormElement).validate()
  // 开始加载
  loading.value = true
  try {
    // 也可以用.then 方法
    await userStore.userLogin(loginFrom)
    // 登录成功跳转到首页
    let redirect = $route.query.redirect as string
    $router.push({ path: redirect || '/' })
    ElNotification({
      type: 'success',
      message: '登录成功',
      title: `Hi,${getTime()}好`,
    })
    loading.value = false
  } catch (error) {
    loading.value = false
    // 登录失败的提示信息
    ElNotification({
      type: 'error',
      message: (error as Error).message,
    })
  }
}

// 自定义校验规则所需函数
const validatorUserName = (_rule: any, value: any, callback: any) => {
  // rule 校验规则对象 value 表单元素内容 callbakc 符合条件放行 不符合条件，调用callback注入错误信息
  if (value.length >= 5) {
    callback()
  } else {
    callback(new Error('账号长度至少5位'))
  }
}
const validatorPassword = (_rule: any, value: any, callback: any) => {
  if (value.length >= 6) {
    callback()
  } else {
    callback(new Error('密码长度至少6位'))
  }
}
// 表单校验规则
const rules = reactive({
  username: [
    // { required: true, min: 6, max: 10, message: '账号长度至少6位', trigger: 'change'},
    { trigger: 'change', validator: validatorUserName },
  ],
  password: [
    // { required: true, min: 6, max: 15, message: '密码长度至少6位', trigger: 'change'},
    { trigger: 'change', validator: validatorPassword },
  ],
})
</script>

<style lang="scss" scoped>
.login_container {
  width: 100%;
  height: 100vh;
  background: url('@/assets/images/background.jpg') no-repeat;
  background-size: cover;
  padding: 40px;

  .login_form {
    position: relative;
    top: 30vh;
    width: 80%;
    background: url('@/assets/images/login_form.png') no-repeat;
    background-size: cover;

    h1 {
      color: white;
      font-size: 40px;
    }

    h2 {
      font-size: 20px;
      color: white;
      margin: 20px 0;
    }

    .login_btn {
      width: 100%;
    }
  }
}
</style>
