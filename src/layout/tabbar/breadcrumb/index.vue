<template>
  <el-icon style="margin-right: 10px" @click="changeIcon">
    <component :is="LayoutSettingStore.fold ? 'Fold' : 'Expand'"></component>
  </el-icon>
  <el-breadcrumb separator-icon="ArrowRight">
    <el-breadcrumb-item
      v-for="item of $route.matched"
      :key="item.path"
      v-show="item.meta.title"
      :to="item.path"
    >
      <el-icon style="margin: 0 3px; vertical-align: 'middle'">
        <component :is="item.meta.icon"></component>
      </el-icon>
      <span>{{ item.meta.title }}</span>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import useLayoutSettingStore from '@/store/modules/setting'
// 用于控制菜单折叠的
let LayoutSettingStore = useLayoutSettingStore()
const changeIcon = () => {
  LayoutSettingStore.fold = !LayoutSettingStore.fold
}
let $route = useRoute()
</script>

<style lang="scss" scoped></style>
