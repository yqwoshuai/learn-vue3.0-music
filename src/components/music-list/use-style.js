import { ref, onMounted, computed } from 'vue'

// 滚动到顶部时，顶部的图片覆盖距离，即图片的最小显示高度
const RESERVED_HEIGHT = 40

export default function useStyle(props) {
  const bgImgRef = ref(null)
  // 最多可以向上移动的临界距离，超过这个距离会改变图片的层级，让图片覆盖住列表
  const maxTranslateY = ref(0)
  // 滚动高度
  const scrollY = ref(0)
  // 图片dom的高度，mounted时才能获取到具体值
  const imageHeight = ref(0)
  onMounted(() => {
    // 可以读取到dom内容时赋值
    imageHeight.value = bgImgRef.value.clientHeight
    maxTranslateY.value = imageHeight.value - RESERVED_HEIGHT
  })
  // 根据滚动高度计算蒙层模糊样式
  const filterStyle = computed(() => {
    let blur = 0
    const scrollYVal = scrollY.value
    const imageHeightVal = imageHeight.value
    // 向上滚动时触发模糊
    if (scrollYVal >= 0) {
      blur =
        Math.min(
          maxTranslateY.value / imageHeightVal,
          scrollYVal / imageHeightVal
        ) * 10
    }
    return {
      backdropFilter: `blur(${blur}px)`
    }
  })
  // 根据滚动计算顶部图片的样式
  const bgImageStyle = computed(() => {
    const scrollYVal = scrollY.value
    let zIndex = 0
    // 固定宽高比
    let paddingTop = '70%'
    let height = 0
    // 处理ios兼容问题
    let translateZ = 0
    // 向上滚动歌曲列表时，超过零界点，则让图片覆盖歌曲列表，留出顶部一段高度不会被歌曲列表覆盖
    if (scrollYVal > maxTranslateY.value) {
      zIndex = 10
      paddingTop = 0
      height = `${RESERVED_HEIGHT}px`
      translateZ = 1
    }
    // 下拉歌曲列表时图片放大效果
    let scale = 1
    if (scrollYVal < 0) {
      scale = 1 + Math.abs(scrollYVal / imageHeight.value)
    }
    return {
      zIndex,
      paddingTop,
      height,
      transform: `scale(${scale}) translateZ(${translateZ}px)`,
      backgroundImage: `url(${props.pic})`
    }
  })
  // 计算初始歌曲列表顶部偏移量，会等于图片的高度
  const scrollStyle = computed(() => {
    return {
      top: `${imageHeight.value}px`
    }
  })
  // 计算随机播放按钮样式
  const playBtnStyle = computed(() => {
    let display = ''
    if (scrollY.value >= maxTranslateY.value) {
      display = 'none'
    } else {
      display = 'block'
    }
    return {
      display
    }
  })

  // 滚动事件获取滚动距离
  function onScroll(pos) {
    // better-scroll向上滚动是负值，所以取负为正值
    scrollY.value = -pos.y
  }
  return {
    bgImgRef,
    onScroll,
    filterStyle,
    scrollStyle,
    bgImageStyle,
    playBtnStyle
  }
}
