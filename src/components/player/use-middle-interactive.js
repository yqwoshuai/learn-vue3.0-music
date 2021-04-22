import { ref } from 'vue'

export default function useMiddleInteractive() {
  // 当前应当显示的模块
  const currentShow = ref('cd')
  // cd模块样式
  const middleLStyle = ref(null)
  // 歌词模块样式
  const middleRStyle = ref(null)

  // 当前实际显示的模块
  let currentView = 'cd'
  // 滑动时储存相关数据
  const touch = {}

  // 开始滑动触发
  function onMiddleTouchStart(e) {
    // 滑动开始时的横坐标
    touch.startX = e.touches[0].pageX
    // 滑动开始时的纵坐标
    touch.startY = e.touches[0].pageY
    // 滑动方向锁
    touch.directionLocked = ''
  }

  // 滑动时触发
  function onMiddleTouchMove(e) {
    // 滑动横向偏移量
    const deltaX = e.touches[0].pageX - touch.startX
    // 滑动纵向偏移量
    const deltaY = e.touches[0].pageY - touch.startY

    // 偏移量可能是负值，取绝对值对比大小
    const absDeltaX = Math.abs(deltaX)
    const absDeltaY = Math.abs(deltaY)

    // 当滑动锁不存在时增加滑动锁
    if (!touch.directionLocked) {
      // 哪个方向的偏移量更大，表示执行哪个方向的滑动
      touch.directionLocked = absDeltaX >= absDeltaY ? 'h' : 'v'
    }

    // 滑动锁为纵向时，表示滚动的时歌词，不需要执行切换操作
    if (touch.directionLocked === 'v') {
      return
    }

    // 根据当前实际显示的是哪个模块，获取歌词模块之前的偏移量
    const left = currentView === 'cd' ? 0 : -window.innerWidth
    // 计算歌词模块当前偏移量，为 -window.innerWidth 到 0 之间
    const offsetWidth = Math.min(0, Math.max(left + deltaX, -window.innerWidth))
    // 歌词模块当前的偏移量占屏幕宽度的百分比
    touch.percent = Math.abs(offsetWidth / window.innerWidth)

    // 当前实际显示的时cd模块时
    if (currentView === 'cd') {
      // 歌词模块占屏幕超过了20%，则表示应当修改为歌词模块
      if (touch.percent > 0.2) {
        currentShow.value = 'lyric'
      } else {
        currentShow.value = 'cd'
      }
    } else {
      // 当前实际显示的时歌词模块时
      // 歌词占屏幕小于80%，则表示应当修改为cd模块
      if (touch.percent < 0.8) {
        currentShow.value = 'cd'
      } else {
        currentShow.value = 'lyric'
      }
    }

    // 滑动时修改对应样式
    middleLStyle.value = {
      opacity: 1 - touch.percent
    }
    middleRStyle.value = {
      transform: `translate3d(${offsetWidth}px, 0, 0)`
    }
  }

  // 滑动结束时触发
  function onMiddleTouchEnd() {
    let offsetWidth
    let opacity
    // 根据当前应当显示的模块是哪个，修改对应的样式
    if (currentShow.value === 'cd') {
      currentView = 'cd'
      offsetWidth = 0
      opacity = 1
    } else {
      currentView = 'lyric'
      offsetWidth = -window.innerWidth
      opacity = 0
    }

    // 滑动结束时给一个缓动动画，滑动进行时不能加，因为滑动进行时样式要实时变化
    const duration = 300
    middleLStyle.value = {
      opacity,
      transitionDuration: `${duration}ms`
    }
    middleRStyle.value = {
      transform: `translate3d(${offsetWidth}px, 0, 0)`,
      transitionDuration: `${duration}ms`
    }
  }

  return {
    currentShow,
    middleLStyle,
    middleRStyle,
    onMiddleTouchStart,
    onMiddleTouchMove,
    onMiddleTouchEnd
  }
}
