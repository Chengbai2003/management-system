<template>
  <div class="year_box">
    <div class="title">
      <p>年度游客量对比</p>
      <img src="../../images/dataScreen-title.png" alt="" />
    </div>
    <div class="charts" ref="charts"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'

let charts = ref()
onMounted(() => {
  let mycharts = echarts.init(charts.value)
  mycharts.setOption({
    xAxis: {
      type: 'category',
      splitLine: { show: false },
    },
    yAxis: {
      show: false,
      splitLine: { show: false },
    },
    grid: { left: 20, right: 0, top: 0, bottom: 20 },
    series: {
      type: 'scatter',
      data: [33, 88, 79, 56, 43, 77, 29, 91, 93, 123, 54, 32, 87, 37, 54, 74],
      symbol: 'diamond',
    },
  })
})
</script>

<style lang="scss" scoped>
.year_box {
  width: 100%;
  height: 100%;
  background: url(../../images/dataScreen-main-cb.png) no-repeat center;
  background-size: 100% 100%;
  margin: 20px 0;
  .title {
    p {
      color: white;
      font-size: 16px;
    }
  }
  .charts {
    height: calc(100% - 30px);
  }
}
</style>
