import { ref } from 'vue'
import animations from 'create-keyframe-animation'

export default function useAnimation() {
  // CD模块dom
  const cdWrapperRef = ref(null)
  // 进入动画锁，表示进入动画正在执行
  let entering = false
  // 离开动画锁，表示离开动画正在执行
  let leaving = true

  // 进入动画 开始执行
  function enter(el, done) {
    // 当离开动画还未结束时，触发进入动画会导致离开动画的结束回调无法执行
    // 手动执行离开动画结束的回调
    if (leaving) {
      afterLeave()
    }
    entering = true
    const { x, y, scale } = getPosAndScale()
    // 定义动画
    const animation = {
      0: {
        transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`
      },
      100: {
        transform: 'translate3d(0, 0, 0) scale(1)'
      }
    }
    // 注册动画
    animations.registerAnimation({
      name: 'move',
      animation,
      presets: {
        duration: 600,
        easing: 'cubic-bezier(0.45, 0, 0.55, 1)'
      }
    })
    // 执行动画
    animations.runAnimation(cdWrapperRef.value, 'move', done)
  }

  // 进入动画 结束执行
  function afterEnter() {
    // 注销动画
    animations.unregisterAnimation('move')
    // 清空动画，修改动画锁
    cdWrapperRef.value.animation = ''
    entering = false
  }

  // 离开动画 开始执行
  function leave(el, done) {
    // 当进入动画还未结束时，触发离开动画会导致进入动画的结束回调无法执行
    // 手动执行进入动画结束的回调
    if (entering) {
      afterEnter()
    }
    leaving = true
    const { x, y, scale } = getPosAndScale()
    const cdWrapperEl = cdWrapperRef.value
    // 直接设置style执行动画
    cdWrapperEl.style.transition = 'all .6s cubic-bezier(0.45, 0, 0.55, 1)'
    cdWrapperEl.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`
    // 监听transitionend动画结束事件，执行回调
    cdWrapperEl.addEventListener('transitionend', next)
    function next() {
      // 注销事件监听，防止下次执行动画时多次执行事件
      cdWrapperEl.removeEventListener('transitionend', next)
      done()
    }
  }

  // 离开动画 结束执行
  function afterLeave() {
    const cdWrapperEl = cdWrapperRef.value
    // 清空动画，修改动画锁
    cdWrapperEl.style.transition = ''
    cdWrapperEl.style.transform = ''
    leaving = false
  }

  // 计算cd模块的偏移量
  function getPosAndScale() {
    // miniCD 的宽度
    const targetWidth = 40
    // miniCD 距离屏幕左侧的距离
    const paddingLeft = 20 + 20
    // miniCD 距离屏幕底部的距离
    const paddingBottom = 20 + 10
    // CD模块 距离屏幕顶部的距离
    const paddingTop = 60 + 20
    // CD模块的宽度
    const width = window.innerWidth * 0.8
    // CD模块x轴的偏移量，向左偏移为负值
    const x = -(window.innerWidth / 2 - paddingLeft)
    // CD模块y轴的偏移量
    const y = window.innerHeight - paddingTop - width / 2 - paddingBottom
    // CD模块的缩放值
    const scale = targetWidth / width

    return {
      x,
      y,
      scale
    }
  }

  return {
    cdWrapperRef,
    enter,
    afterEnter,
    leave,
    afterLeave
  }
}
