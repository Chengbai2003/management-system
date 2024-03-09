<template>
  <div class="tourist_box">
    <div class="top">
      <p class="title">实时游客统计</p>
      <p class="bg"></p>
      <p class="right">
        可预约总量：
        <span>18999</span>
        人
      </p>
    </div>
    <div class="number">
      <span v-for="(i, index) of people" :key="index">{{ i }}</span>
    </div>
    <!-- echarts展示图形图表 -->
    <div class="charts" ref="charts">123</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'
import 'echarts-liquidfill'

let people = ref('216908人')
let charts = ref<any>()
onMounted(() => {
  // 获取echarts实例
  let mycharts = echarts.init(charts.value)
  // 配置数据
  mycharts.setOption({
    title: {
      show: false,
    },
    // x and y 轴组件
    xAxis: {},
    yAxis: {},
    // 系列
    series: {
      type: 'liquidFill', // 类型
      data: [0.6, 0.4, 0.5, 0.2, 0.3], //数据
      radius: '90%', // 圆的半径
      label: {
        show: false,
      },
    },
    // 布局组件
    grid: {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
    },
  })
})
</script>

<style lang="scss" scoped>
.tourist_box {
  background: url(../../images/dataScreen-main-lb.png) no-repeat;
  background-size: 100% 100%;
  margin-top: 10px;
  color: white;
  .top {
    margin-left: 20px;
    .title {
      font-size: 20px;
    }
    .bg {
      width: 68px;
      height: 7px;
      background: url(../../images/dataScreen-title.png) no-repeat;
      background-size: 100% 100%;
      margin-top: 10px;
    }
    .right {
      float: right;
      font-size: 18px;
      span {
        color: orange;
      }
    }
  }
  .number {
    margin-top: 40px;
    display: flex;
    padding: 10px;
    span {
      flex: 1;
      height: 40px;
      text-align: center;
      line-height: 40px;
      background: url(../../images/total.png) no-repeat;
      color: #29fcff;
      font-size: 30px;
      background-size: 100% 100%;
    }
  }
  .charts {
    width: 100%;
    height: 250px;
  }
}
</style>
