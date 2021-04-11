import { computed, ref } from 'vue'

export default function useShortcut(props, groupRef) {
  // 导航元素的默认高度
  const ANCHOR_HEIGHT = 18
  // 列表滚动实例，用于调用列表的滚动方法
  const scrollRef = ref(null)

  // 返回导航条列表，由子列表的title组成
  const shortcutList = computed(() => {
    return props.data.map(group => {
      return group.title
    })
  })

  // touch对象保存触摸的数据，在多个函数中使用
  const touch = {}

  // 点击导航跳转对应子列表
  function onShortcutTouchStart(e) {
    const anchorIndex = parseInt(e.target.dataset.index)
    touch.y1 = e.touches[0].pageY
    touch.anchorIndex = anchorIndex
    scrollTo(anchorIndex)
  }

  // 在导航上滑动时跳转对应子列表
  function onShortcutTouchMove(e) {
    touch.y2 = e.touches[0].pageY
    // 根据 touchstart 和 touchmove 两次touch事件的 y值偏移量 计算当前显示的index , | 0 为取整
    const delta = ((touch.y2 - touch.y1) / ANCHOR_HEIGHT) | 0
    const anchorIndex = touch.anchorIndex + delta
    scrollTo(anchorIndex)
  }

  function scrollTo(index) {
    // 处理值非法的情况，可能滑动到其他dom上导致没有 dataset
    if (isNaN(index)) {
      return
    }
    // 处理index的边界，只能在0到shortcutList.value.length - 1之间
    index = Math.max(0, Math.min(shortcutList.value.length - 1, index))
    // 找到当前index在主列表中对应的子列表dom
    const targetEl = groupRef.value.children[index]
    const scroll = scrollRef.value.scroll
    // 使用better-scroll滚动方法scrollToElement滚动到对应dom
    scroll.scrollToElement(targetEl, 0)
  }

  return {
    shortcutList,
    scrollRef,
    onShortcutTouchStart,
    onShortcutTouchMove
  }
}
