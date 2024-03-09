<template>
  <div class="container">
    <!-- 数据大屏内容区 -->
    <div class="screen" ref="screen">
      <Top />
      <div class="bottom">
        <div class="left">
          <Tourist class="tourist" />
          <Sex class="sex" />
          <Age class="age" />
        </div>
        <div class="center">
          <Map class="map" />
          <Line class="line" />
        </div>
        <div class="right">
          <Rank class="rank" />
          <Year class="year" />
          <Counter class="counter" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
// 顶部组件
import Top from './components/top/index.vue'
// 左侧组件
import Tourist from './components/tourist/index.vue'
import Sex from './components/sex/index.vue'
import Age from './components/age/index.vue'
// 中间组件
import Map from './components/map/index.vue'
import Line from './components/line/index.vue'
// 右侧组件
import Rank from './components/rank/index.vue'
import Year from './components/year/index.vue'
import Counter from './components/counter/index.vue'

let screen = ref<any>()

onMounted(() => {
  screen.value.style.transform = `scale(${getScale()}) translate(-50%,-50%)`
})

// 定于大屏缩放比例
const getScale = (w = 1920, h = 1080) => {
  const ww = window.innerWidth / w
  const wh = window.innerHeight / h
  return ww < wh ? ww : wh
}

// 监听视口变化
window.onresize = () => {
  screen.value.style.transform = `scale(${getScale()}) translate(-50%,-50%)`
}
</script>

<style lang="scss" scoped>
.container {
  width: 100vw;
  height: 100vh;
  background: url(./images/bg.png) no-repeat;
  background-size: cover;
  .screen {
    position: fixed;
    width: 1920px;
    height: 1080px;
    left: 50%;
    top: 50%;
    transform-origin: left top;
    .bottom {
      display: flex;
      .right {
        flex: 1;
        display: flex;
        flex-direction: column;
        margin-left: 20px;
        .rank {
          flex: 1.2;
        }
        .year {
          flex: 1;
        }
        .counter {
          flex: 1;
        }
      }
      .left {
        flex: 1;
        height: 1040px;
        display: flex;
        flex-direction: column;
        .tourist {
          flex: 1.2;
        }
        .sex {
          flex: 1;
        }
        .age {
          flex: 1;
        }
      }
      .center {
        flex: 2;
        display: flex;
        flex-direction: column;
        .map {
          flex: 3;
        }
        .line {
          flex: 1;
        }
      }
    }
  }
}
</style>
