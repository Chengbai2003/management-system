<template>
  <el-card>
    <div class="box">
      <img :src="userStore.avatar" class="avatar" />
      <div class="bottom">
        <h3 class="title">{{ getTime() + '好,' + userStore.username }}</h3>
        <p class="tip">后台管理系统</p>
      </div>
    </div>
  </el-card>
  <div class="bottom_bacg">
    <svg-icon name="welcome" width="500px" height="500px" />
  </div>
</template>

<script setup lang="ts">
// 引入
import { onMounted } from 'vue'
import useUserStore from '@/store/modules/user'
import { getTime } from '@/utils/time'

let userStore = useUserStore()
// 首页挂载完毕 发送请求
onMounted(() => {
  userStore.userInfo()
})
</script>

<style lang="scss" scoped>
.box {
  display: flex;
  align-items: center;
  .avatar {
    width: 100px;
    height: 100px;
    border-radius: 50%;
  }
  .bottom {
    margin-left: 20px;
    .title {
      font-size: 30px;
      font-weight: 900;
      margin-bottom: 10px;
    }
    .tip {
      font-style: italic;
      color: gray;
    }
  }
}

.bottom_bacg {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  .svg-icon {
    width: 500px;
    height: 500px;
  }
}
</style>
