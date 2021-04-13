import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import lazyPlugin from 'vue3-lazy'
import loadingDirective from './components/base/loading/directive'
import noResultDirective from './components/base/no-result/directive'

import '@/assets/scss/index.scss'
// 使用插件
function usePlugin() {
  return createApp(App)
    .use(store)
    .use(router)
    .use(lazyPlugin, {
      loading: require('@/assets/images/default.png')
    })
}

// 注册自定义指令
function signDirective() {
  return usePlugin()
    .directive('loading', loadingDirective)
    .directive('noResult', noResultDirective)
}

// 渲染
signDirective().mount('#app')
