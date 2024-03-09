<template>
  <div class="rank_box">
    <div class="title">
      <p>热门景区排行</p>
      <img src="../../images/dataScreen-title.png" alt="" />
    </div>
    <div class="charts" ref="charts"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'

let charts = ref()

let colorList = [
  'rgba(255, 174, 0, 1)',
  'rgba(183, 206, 255, 1)',
  'rgba(226, 134, 88, 1)',
  '#2379FF',
  '#2379FF',
  '#2379FF',
  '#2379FF',
  '#2379FF',
]
let result = [
  { name: '泰山', value: 580 },
  { name: '华山', value: 536 },
  { name: '嵩山', value: 504 },
  { name: '黄山', value: 483 },
  { name: '衡山', value: 351 },
  { name: '恒山', value: 307 },
]
let option = {
  color: colorList,
  tooltip: {
    show: true,
    trigger: 'item',
    padding: [8, 15],
    backgroundColor: 'rgba(12, 51, 115,0.8)',
    borderColor: 'rgba(3, 11, 44, 0.5)',
    textStyle: {
      color: 'rgba(255, 255, 255, 1)',
    },
  },
  legend: {
    show: false,
  },
  grid: {
    left: '70',
    right: '16%',
    top: '15%',
    bottom: '8%',
  },
  xAxis: [
    {
      splitLine: {
        show: false,
      },
      type: 'value',
      show: false,
    },
  ],
  yAxis: [
    {
      splitLine: {
        show: false,
      },
      axisLine: {
        show: false,
      },
      type: 'category',
      axisTick: {
        show: false,
      },
      inverse: true,
      data: result.map((item) => item.name),
      axisLabel: {
        color: '#fff',
        fontSize: 14,
        margin: 10,
        formatter: (name: any, index: any) => {
          const id = index + 1
          if (id < 4) {
            return `{icon${id}|${id}}`
          } else {
            return `{count|${id}}`
          }
        },
        rich: {
          icon1: {
            width: 30,
            height: 25,
            padding: [5, 0, 2, 0],
            align: 'center',
            backgroundColor: 'rgba(255, 174, 0, 1)',
            color: '#ffffff',
            fontSize: 20,
          },
          icon2: {
            width: 30,
            height: 25,
            padding: [5, 0, 2, 0],
            align: 'center',
            backgroundColor: 'rgba(183, 206, 255, 1)',
            color: '#ffffff',
            fontSize: 20,
          },
          icon3: {
            width: 30,
            height: 25,
            padding: [5, 0, 2, 0],
            align: 'center',
            backgroundColor: 'rgba(226, 134, 88, 1)',
            color: '#ffffff',
            fontSize: 20,
          },
          count: {
            width: 30,
            height: 25,
            padding: [5, 0, 2, 0],
            align: 'center',
            backgroundColor: '#2379FF',
            color: '#ffffff',
            fontSize: 20,
          },
        },
      },
    },
    {
      type: 'category',
      inverse: true,
      axisTick: 'none',
      axisLine: 'none',
      show: true,
      axisLabel: {
        textStyle: {
          color: '#fff',
          fontSize: 12,
        },
        formatter: function (value: number) {
          return value + '次'
        },
      },
      data: result.map((item) => item.value),
    },
  ],
  series: [
    {
      name: '',
      type: 'bar',
      barWidth: 10, // 柱子宽度
      MaxSize: 0,
      showBackground: true,
      barBorderRadius: [30, 0, 0, 30],
      backgroundStyle: {
        color: '#194B72',
      },
      label: {
        show: true,
        offset: [10, -16],
        color: '#fff',
        fontWeight: 500,
        position: 'left',
        align: 'left',
        formatter: function (params: any) {
          return params.data.name
        },
      },
      data: result.map((item, index) => {
        return {
          name: item.name,
          value: item.value,
          itemStyle: {
            barBorderRadius: [30, 0, 0, 30],
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 1,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: '#0F1F45',
                },
                {
                  offset: 1,
                  color: colorList[index],
                },
              ],
            },
          },
        }
      }),
    },
  ],
}

onMounted(() => {
  let mycharts = echarts.init(charts.value)
  mycharts.setOption(option)
})
</script>

<style lang="scss" scoped>
.rank_box {
  width: 100%;
  height: 100%;
  background: url(../../images/dataScreen-main-rb.png) no-repeat;
  background-size: 100% 100%;
  margin: 20px 0;
  .title {
    margin-left: 20px;
    p {
      color: white;
      font-size: 20px;
    }
  }
  .charts {
    height: calc(100% - 30px);
  }
}
</style>
