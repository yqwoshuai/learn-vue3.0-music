import { ref, watch, nextTick, computed } from 'vue'

export default function useFixed(props) {
  const TITLE_HEIGHT = 30 // title的默认高度
  const groupRef = ref(null) // 整体列表dom
  const listHeight = ref([]) // 每个子列表的高度
  const scrollY = ref(0) // 当前滚动高度
  const currentIndex = ref(0) // 当前子列表索引
  const distance = ref(0) //

  // 计算当前固定顶部的标题
  const fixedTitle = computed(() => {
    // 处理顶部时下拉的情况
    if (scrollY.value < 0) {
      return ''
    }
    // 找到对应的标题返回
    const currentGroup = props.data[currentIndex.value]
    return currentGroup ? currentGroup.title : ''
  })

  // 计算子列表标题向上的偏移量
  const fixedStyle = computed(() => {
    const distanceVal = distance.value
    const diff =
      distanceVal > 0 && distanceVal < TITLE_HEIGHT
        ? distanceVal - TITLE_HEIGHT
        : 0
    // 直接返回style给组件绑定
    return {
      transform: `translate3d(0, ${diff}px, 0)`
    }
  })
  // 监听数据变化，数据变化时重新计算高度
  watch(
    () => props.data,
    async () => {
      // 在dom生成完毕之后再计算高度
      await nextTick()
      calculate()
    }
  )
  // 监听滚动的高度
  watch(scrollY, newY => {
    const listHeightVal = listHeight.value
    // 每次滚动时判断当前的高度在高度列表中的哪个区间
    for (let i = 0; i < listHeightVal.length - 1; i++) {
      const heightTop = listHeightVal[i]
      const heightBottom = listHeightVal[i + 1]
      // 找到对应区间则设置当前标题索引和偏移高度
      if (newY >= heightTop && newY <= heightBottom) {
        currentIndex.value = i
        distance.value = heightBottom - newY
      }
    }
  })

  // 计算子列表的高度数组
  function calculate() {
    // 子列表dom数组
    const list = groupRef.value.children
    const listHeightVal = listHeight.value
    // 初始高度 0
    let height = 0

    listHeightVal.length = 0
    listHeightVal.push(height)

    // 获取每个子列表的dom高度，组成高度数组
    for (let i = 0; i < list.length; i++) {
      height += list[i].clientHeight
      listHeightVal.push(height)
    }
  }

  // 处理滚动事件
  function onScroll(pos) {
    // better-scroll返回的滚动高度是负值，所以取 -pos.y
    scrollY.value = -pos.y
  }

  return {
    groupRef,
    onScroll,
    fixedTitle,
    fixedStyle
  }
}
