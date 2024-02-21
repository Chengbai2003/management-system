<template>
  <template v-for="item in menuList" :key="item.path">
    <template v-if="!item.children">
      <el-menu-item
        v-if="!item.meta.hidden"
        :index="item.path"
        @click="goRoute"
      >
        <el-icon>
          <component :is="item.meta.icon" />
        </el-icon>
        <template #title>
          <span>{{ item.meta.title }}</span>
        </template>
      </el-menu-item>
    </template>
    <template v-if="item.children && item.children.length === 1">
      <el-menu-item
        v-if="!item.children[0].meta.hidden"
        :index="item.children[0].path"
        @click="goRoute"
      >
        <el-icon>
          <component :is="item.children[0].meta.icon" />
        </el-icon>
        <template #title>
          <span>{{ item.children[0].meta.title }}</span>
        </template>
      </el-menu-item>
    </template>

    <el-sub-menu
      v-if="item.children && item.children.length > 1"
      :index="item.path"
      @click="goRoute"
    >
      <template #title>
        <el-icon>
          <component :is="item.meta.icon" />
        </el-icon>
        <span>{{ item.meta.title }}</span>
      </template>
      <myMenu :menuList="item.children"></myMenu>
    </el-sub-menu>
  </template>
</template>

<script setup lang="ts">
// 获取路由器对象
import { useRouter } from 'vue-router'
// 获取父组件传过来的值
defineProps(['menuList'])
let $router = useRouter()
const goRoute = (vc: any) => {
  vc.index && $router.push(vc.index)
}

defineOptions({
  name: 'myMenu',
})
</script>

<style lang="scss" scoped></style>
