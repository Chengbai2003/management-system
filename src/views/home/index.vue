<template>
  <div>
    <h1>我是一级路由展示登录成功后展示数据</h1>
  </div>
</template>

<script setup lang="ts">
// 引入
import { onMounted } from 'vue'
import useUserStore from '@/store/modules/user'
let userStore = useUserStore()
// 首页挂载完毕 发送请求
onMounted(() => {
  userStore.userInfo()
})
</script>

<style lang="scss" scoped></style>
