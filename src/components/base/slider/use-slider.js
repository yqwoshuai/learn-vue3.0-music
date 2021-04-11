import BScroll from '@better-scroll/core'
import Slide from '@better-scroll/slide'

import { onMounted, onUnmounted, ref } from 'vue'

BScroll.use(Slide)

export default function useSlider(wrapperRef) {
  const slider = ref(null)
  const currentPageIndex = ref(0)

  // onMounted 时可以获取到dom，此时初始化轮播实例
  onMounted(() => {
    const sliderVal = (slider.value = new BScroll(wrapperRef.value, {
      click: true, // 允许触发点击事件
      scrollX: true, // 横向滚动
      scrollY: false, // 禁止纵向滚动
      momentum: false, // 禁止滑动动量
      bounce: false, // 禁止回弹
      probeType: 2, // 触发scroll事件的方式
      slide: true // 启用slide插件
    }))

    console.log(slider)
    // 监听slideWillChange事件，改变轮播底部的active按钮
    sliderVal.on('slideWillChange', page => {
      currentPageIndex.value = page.pageX
    })
  })

  // 组件卸载时销毁轮播实例
  onUnmounted(() => {
    console.log(slider)
    slider.value.destroy()
  })

  return {
    slider,
    currentPageIndex
  }
}
