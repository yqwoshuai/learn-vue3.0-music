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
    useScroll(rootRef, props, emit)

    return {
      rootRef
    }
  }
}
</script>

<style></style>
