import { createApp } from 'vue'
import Loading from './loading'
import { addClass, removeClass } from '@/assets/js/dom'

const relativeCls = 'g-relative'

// 定义自定义指令v-loading
const loadingDirective = {
  // 自定义指令绑定的组件初始化时
  mounted(el, binding) {
    // 动态创建一个新实例，用于挂载到传入的el上，即自定义指令绑定的dom
    const app = createApp(Loading)
    const instance = app.mount(document.createElement('div'))
    // 将实例保存在el上，其他方法读取el时也能访问新实例
    el.instance = instance
    // 自定义指令参数的动态参数
    const title = binding.arg
    if (typeof title !== 'undefined') {
      // Loading组件内部定义了setTitle方法，会挂载到实例上
      instance.setTitle(title)
    }
    if (binding.value) {
      append(el)
    }
  },
  // 自定义指令的组件更新时
  updated(el, binding) {
    const title = binding.arg
    if (typeof title !== 'undefined') {
      el.instance.setTitle(title)
    }
    // 新旧值不相同时处理el的子元素
    if (binding.value !== binding.oldValue) {
      binding.value ? append(el) : remove(el)
    }
  }
}

function append(el) {
  const style = getComputedStyle(el)
  if (['absolute', 'fixed', 'relative'].indexOf(style.position) === -1) {
    addClass(el, relativeCls)
  }
  // $el是新实例生成的dom结构
  el.appendChild(el.instance.$el)
}

function remove(el) {
  removeClass(el, relativeCls)
  el.removeChild(el.instance.$el)
}

export default loadingDirective
