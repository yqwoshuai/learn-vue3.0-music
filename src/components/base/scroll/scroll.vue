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
    }
  },
  setup(props) {
    // 封装滚动逻辑
    const rootRef = ref(null)
    useScroll(rootRef, props)

    return {
      rootRef
    }
  }
}
</script>

<style></style>
