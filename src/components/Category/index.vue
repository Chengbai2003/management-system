<template>
  <el-card>
    <el-form :inline="true">
      <el-form-item label="一级分类">
        <el-select
          :disabled="scene"
          placeholder="请选择"
          style="width: 200px"
          v-model="categoryStore.c1Id"
          @change="change1"
        >
          <el-option
            v-for="item of categoryStore.list1"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select
          :disabled="scene"
          placeholder="请选择"
          style="width: 200px"
          @change="change2"
          v-model="categoryStore.c2Id"
        >
          <el-option
            v-for="item of categoryStore.list2"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select
          :disabled="scene"
          placeholder="请选择"
          style="width: 200px"
          v-model="categoryStore.c3Id"
        >
          <el-option
            v-for="item of categoryStore.list3"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import useCategoryStore from '@/store/modules/category'
const categoryStore = useCategoryStore()

onMounted(() => {
  getC1()
})
const getC1 = () => {
  categoryStore.getC1()
}
const change1 = () => {
  categoryStore.c2Id = categoryStore.c3Id = ''
  categoryStore.list3 = []
  categoryStore.getC2()
}
const change2 = () => {
  categoryStore.c3Id = ''
  categoryStore.getC3()
}

// 接受值
defineProps(['scene'])
</script>

<style lang="scss" scoped></style>
