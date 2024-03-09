<template>
  <div class="line_box">
    <div class="title">
      <p>未来7天游客趋势图</p>
      <img src="../../images/dataScreen-title.png" alt="" />
    </div>
    <div class="charts" ref="line"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'

let line = ref()
onMounted(() => {
  let mycharts = echarts.init(line.value)
  mycharts.setOption({
    xAxis: {
      type: 'category',
      // 两侧不留白
      boundaryGap: false,
      splitLine: { show: false },
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    },
    yAxis: {
      axisLine: { show: true },
      splitLine: { show: false },
    },
    grid: {
      left: 40,
      right: 20,
      top: 0,
      bottom: 25,
    },
    series: [
      {
        type: 'line',
        data: [108, 209, 134, 81, 247, 343, 297],
        smooth: true,
        // 区域填充样式
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: '#1890FF', // 0% 处的颜色
              },
              {
                offset: 1,
                color: '#000', // 100% 处的颜色
              },
            ],
            global: false,
          },
        },
      },
    ],
  })
})
</script>

<style lang="scss" scoped>
.line_box {
  width: 100%;
  height: 100%;
  background: url(../../images/dataScreen-main-cb.png) no-repeat center;
  background-size: 100% 100%;
  margin: 0 10px 0 10px;
  .title {
    margin-left: 20px;
    p {
      color: white;
      font-size: 20px;
    }
  }
  .charts {
    height: calc(100% - 40px);
    margin: 0;
  }
}
</style>
