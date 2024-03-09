<template>
  <div class="year_box">
    <div class="title">
      <p>预约渠道数据统计</p>
      <img src="../../images/dataScreen-title.png" alt="" />
    </div>
    <div class="charts" ref="charts"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'

let charts = ref()
let option = {
  tooltip: {
    trigger: 'item',
  },
  legend: {
    top: 40,
    right: 30,
    orient: 'vertical',
    textStyle: {
      color: 'white',
      fontSize: 14,
    },
  },
  series: [
    {
      name: 'Access From',
      type: 'pie',
      radius: ['40%', '70%'],
      avoidLabelOverlap: false,
      padAngle: 5,
      itemStyle: {
        borderRadius: 10,
      },
      label: {
        show: true,
        position: 'inside',
        color: 'white',
      },
      labelLine: {
        show: false,
      },
      data: [
        { value: 503, name: '网站' },
        { value: 1789, name: '公众号' },
        { value: 1028, name: '小程序' },
        { value: 734, name: 'app' },
        { value: 478, name: '线下' },
      ],
    },
  ],
  // 调整图形位置
  grid: {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
}
onMounted(() => {
  let mycharts = echarts.init(charts.value)
  mycharts.setOption(option)
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
    height: calc(100% - 40px);
  }
}
</style>
