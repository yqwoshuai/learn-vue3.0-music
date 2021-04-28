<template>
  <ul class="switches">
    <li
      class="switch-item"
      v-for="(item, index) in items"
      :key="item"
      :class="{ active: modelValue === index }"
      @click="switchItem(index)"
    >
      <span>{{ item }}</span>
    </li>
    <div class="active-bar" :style="activeStyle"></div>
  </ul>
</template>

<script>
export default {
  name: 'switches',
  props: {
    items: {
      type: Array,
      default() {
        return []
      }
    },
    // vue3新语法，modelValue是v-model默认的绑定值
    modelValue: {
      type: Number,
      default: 0
    }
  },
  computed: {
    // 切换tab底部背景移动动画
    activeStyle() {
      const x = 120 * this.modelValue
      return {
        transform: `translate3d(${x}px, 0, 0)`
      }
    }
  },
  methods: {
    // 切换按钮派发更新modelValue事件
    switchItem(index) {
      this.$emit('update:modelValue', index)
    }
  }
}
</script>

<style scoped lang="scss">
.switches {
  display: flex;
  position: relative;
  align-items: center;
  width: 240px;
  margin: 0 auto;
  border: 1px solid $color-highlight-background;
  border-radius: 5px;
  .switch-item {
    position: relative;
    z-index: 10;
    flex: 1;
    height: 30px;
    line-height: 30px;
    text-align: center;
    font-size: $font-size-medium;
    color: $color-text-d;
    &.active {
      color: $color-text;
    }
  }
  .active-bar {
    position: absolute;
    left: 0;
    top: 0;
    width: 120px;
    height: 30px;
    transition: transform 0.3s;
    border-radius: 5px;
    background: $color-highlight-background;
  }
}
</style>
