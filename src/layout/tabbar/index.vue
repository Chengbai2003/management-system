<!-- eslint-disable prettier/prettier -->
<template>
  <div class="tabbar">
    <div class="tabbar_left">
      <BreadCrumb />
    </div>
    <div class="tabbar_right">
      <Setting />
    </div>
  </div>
</template>

<script setup lang="ts">
import BreadCrumb from './breadcrumb/index.vue'
import Setting from './setting/index.vue'

defineOptions({
  name: 'Tabbar',
})
</script>

<style lang="scss" scoped>
.tabbar {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  background-image: linear-gradient(to right, white, skyblue);
  .tabbar_left {
    display: flex;
    margin-left: 20px;
    align-items: center;
  }
  .tabbar_right {
    display: flex;
    align-items: center;
  }
}
</style>
