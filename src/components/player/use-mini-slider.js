import { computed, ref, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { useStore } from 'vuex'
import BScroll from '@better-scroll/core'
import Slide from '@better-scroll/slide'
BScroll.use(Slide)

export default function useCD() {
  const sliderWrapperRef = ref(null)
  const slider = ref(null)

  const store = useStore()
  const fullScreen = computed(() => store.state.fullScreen)
  const playList = computed(() => store.state.playList)
  const currentIndex = computed(() => store.state.currentIndex)
  // mini slider是否展示
  const sliderShow = computed(() => {
    return !fullScreen.value && !!playList.value
  })

  onMounted(() => {
    let sliderVal
    // 监听slider是否展示
    watch(sliderShow, async newSliderShow => {
      // slider展示时，dom更新完毕，注册bs实例
      if (newSliderShow) {
        await nextTick()
        if (!sliderVal) {
          sliderVal = slider.value = new BScroll(sliderWrapperRef.value, {
            click: true,
            scrollX: true,
            scrollY: false,
            momentum: false,
            bounce: false,
            probeType: 2,
            slide: {
              autoplay: false,
              loop: true
            }
          })
          // slider切换结束时触发，改变播放歌曲
          sliderVal.on('slidePageChanged', ({ pageX }) => {
            store.commit('setCurrentIndex', pageX)
          })
        } else {
          // bs实例已经存在时刷新slider
          sliderVal.refresh()
        }
        // 初始化时跳转到对应的slider
        sliderVal.goToPage(currentIndex.value, 0, 0)
      }
    })
    // 监听当前播放歌曲索引
    watch(currentIndex, newIndex => {
      // 滚动到索引对应的slider
      if (sliderVal && sliderShow.value) {
        sliderVal.goToPage(newIndex, 0, 0)
      }
    })
    // 监听播放列表
    watch(playList, async newList => {
      // 播放列表存在，组件展示，且slider已经初始化时刷新slider
      if (sliderVal && sliderShow.value && newList.length) {
        await nextTick()
        sliderVal.refresh()
      }
    })
  })

  // 组件卸载时注销slider实例
  onUnmounted(() => {
    if (slider.value) {
      slider.value.destroy()
    }
  })

  return {
    slider,
    sliderWrapperRef
  }
}
