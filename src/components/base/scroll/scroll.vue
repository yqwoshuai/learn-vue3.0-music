<template>
  <div ref="rootRef">
    <slot></slot>
  </div>
</template>

<script>
import useScroll from './use-scroll'
import { ref } from 'vue'
export default {
  name: 'scroll',
  props: {
    click: {
      type: Boolean,
      default: true
    },
    probeType: {
      type: Number,
      default: 0
    }
  },
  // 定义需要监听的自定义事件
  emits: ['scroll'],
  setup(props, { emit }) {
    // 封装滚动逻辑
    const rootRef = ref(null)
    // 将scroll实例抛出，给其他组件调用
    const scroll = useScroll(rootRef, props, emit)

    return {
      rootRef,
      scroll
    }
  }
}
</script>

<style></style>
