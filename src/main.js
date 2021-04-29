import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import lazyPlugin from 'vue3-lazy'
import loadingDirective from './components/base/loading/directive'
import noResultDirective from './components/base/no-result/directive'

import '@/assets/scss/index.scss'

import { load, saveAll } from '@/assets/js/array-store'
import { FAVORITE_KEY, PLAY_KEY } from '@/assets/js/constant'
import { processSongs } from '@/service/songs'
// 歌曲播放链接每天都会过期，需要重新获取
const favoriteSongs = load(FAVORITE_KEY)
if (favoriteSongs.length > 0) {
  processSongs(favoriteSongs).then(songs => {
    store.commit('setFavoriteList', songs)
    saveAll(songs, FAVORITE_KEY)
  })
}
const historySongs = load(PLAY_KEY)
if (historySongs.length > 0) {
  processSongs(historySongs).then(songs => {
    store.commit('setPlayHistory', songs)
    saveAll(songs, PLAY_KEY)
  })
}

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
