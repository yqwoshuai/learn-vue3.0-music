import { createApp } from 'vue'
import { addClass, removeClass } from '@/assets/js/dom'

const relativeCls = 'g-relative'

// 定义自定义指令
export default function createLoadDirective(Comp) {
  return {
    // 自定义指令绑定的组件初始化时
    mounted(el, binding) {
      // 动态创建一个新实例，用于挂载到传入的el上，即自定义指令绑定的dom
      const app = createApp(Comp)
      const instance = app.mount(document.createElement('div'))
      // 将实例保存在el上，其他方法读取el时也能访问新实例，根据组件name绑定在不同的组件上
      const name = Comp.name
      if (!el[name]) {
        el[name] = {}
      }
      el[name].instance = instance
      // 自定义指令参数的动态参数
      const title = binding.arg
      if (typeof title !== 'undefined') {
        // Comp组件内部定义了setTitle方法，会挂载到实例上
        instance.setTitle(title)
      }
      if (binding.value) {
        append(el)
      }
    },
    // 自定义指令的组件更新时
    updated(el, binding) {
      const name = Comp.name
      const title = binding.arg
      if (typeof title !== 'undefined') {
        el[name].instance.setTitle(title)
      }
      // 新旧值不相同时处理el的子元素
      if (binding.value !== binding.oldValue) {
        binding.value ? append(el) : remove(el)
      }
    }
  }

  function append(el) {
    const name = Comp.name
    const style = getComputedStyle(el)
    if (['absolute', 'fixed', 'relative'].indexOf(style.position) === -1) {
      addClass(el, relativeCls)
    }
    // $el是新实例生成的dom结构
    el.appendChild(el[name].instance.$el)
  }

  function remove(el) {
    const name = Comp.name
    removeClass(el, relativeCls)
    el.removeChild(el[name].instance.$el)
  }
}
