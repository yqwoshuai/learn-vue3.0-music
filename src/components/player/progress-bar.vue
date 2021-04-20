<template>
  <div class="progress-bar" @click="onClick" ref="outerProgressRef">
    <div class="bar-inner">
      <div class="progress" ref="innerProgressRef" :style="progressStyle"></div>
      <div
        class="progress-btn-wrapper"
        :style="btnStyle"
        @touchstart.prevent="onTouchStart"
        @touchmove.prevent="onTouchMove"
        @touchend.prevent="onTouchEnd"
      >
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, watch, ref, toRef } from 'vue'
// 进度条按钮默认宽度
const progressBtnWidth = 16
// 拖动进度条按钮相关信息
const touch = {}
export default {
  name: 'progress-bar',
  emits: ['progress-changing', 'progress-changed'],
  props: {
    progress: {
      type: Number,
      default: 0
    }
  },
  setup(props, { emit }) {
    // 进度条偏移量
    const offset = ref(0)
    // 监听props的属性需要toRef，解构取props的值需要toRefs
    const progress = toRef(props, 'progress')
    // 内层进度条dom
    const innerProgressRef = ref(null)
    // 外层进度条dom
    const outerProgressRef = ref(null)
    // 外层进度条dom宽度
    const outerProgressWidth = computed(() => {
      return outerProgressRef.value.clientWidth || 0
    })
    // 监听播放进度变化
    watch(progress, newProgress => {
      // 更新内层进度条位置
      setOffset(newProgress)
    })
    // 内层进度条宽度
    const progressStyle = computed(() => {
      return `width:${offset.value}px`
    })
    // 进度条按钮偏移量
    const btnStyle = computed(() => {
      return `transform: translate3d(${offset.value}px,0,0)`
    })
    // 外部定义一个touch对象用来保存触摸事件的信息
    // 进度条按钮触摸事件，保存触摸的位置
    function onTouchStart(e) {
      touch.x1 = e.touches[0].pageX
      touch.beginWidth = offset.value
    }
    // 拖动进度条按钮时改变播放时间，内部进度条宽度和按钮偏移量
    function onTouchMove(e) {
      const delta = e.touches[0].pageX - touch.x1
      const tempWidth = touch.beginWidth + delta
      const barWidth = outerProgressWidth.value - progressBtnWidth
      const progress = Math.min(1, Math.max(tempWidth / barWidth, 0))
      offset.value = barWidth * progress
      // 派发事件，告诉外部正在拖动进度条，传出进度条当前百分比
      emit('progress-changing', progress)
    }
    // 松开进度条按钮时触发
    function onTouchEnd(e) {
      const barWidth = outerProgressWidth.value - progressBtnWidth
      const progress = innerProgressRef.value.clientWidth / barWidth
      // 派发事件，告诉外部拖动结束，传出进度条当前百分比
      emit('progress-changed', progress)
    }
    // 点击进度条直接跳到对应播放进度
    function onClick(e) {
      const rect = outerProgressRef.value.getBoundingClientRect()
      const offsetWidth = e.pageX - rect.left
      const barWidth = outerProgressWidth.value - progressBtnWidth
      const progress = offsetWidth / barWidth
      // 派发事件，告诉外部新的播放进度
      emit('progress-changed', progress)
    }
    // 更新内层进度条位置
    function setOffset(progress) {
      const barWidth = outerProgressWidth.value - progressBtnWidth
      offset.value = barWidth * progress
    }
    
    return {
      outerProgressRef,
      innerProgressRef,
      onTouchStart,
      onTouchMove,
      onTouchEnd,
      onClick,
      progressStyle,
      btnStyle,
      setOffset
    }
  }
}
</script>

<style lang="scss" scoped>
.progress-bar {
  height: 30px;
  .bar-inner {
    position: relative;
    top: 13px;
    height: 4px;
    background: rgba(0, 0, 0, 0.3);
    .progress {
      position: absolute;
      height: 100%;
      background: $color-theme;
    }
    .progress-btn-wrapper {
      position: absolute;
      left: -8px;
      top: -13px;
      width: 30px;
      height: 30px;
      .progress-btn {
        position: relative;
        top: 7px;
        left: 7px;
        box-sizing: border-box;
        width: 16px;
        height: 16px;
        border: 3px solid $color-text;
        border-radius: 50%;
        background: $color-theme;
      }
    }
  }
}
</style>
