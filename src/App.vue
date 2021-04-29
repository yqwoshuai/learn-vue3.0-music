<template>
  <m-header></m-header>
  <tab></tab>
  <!-- 路由命名视图 -->
  <router-view :style="viewStyle"></router-view>
  <router-view :style="viewStyle" name="user" v-slot="{ Component }">
    <transition appear name="slide">
      <component :is="Component" />
    </transition>
  </router-view>
  <player></player>
</template>
<script>
import Header from '@/components/header/header'
import Tab from './components/tab/tab'
import Player from './components/player/player'
import { mapState } from 'vuex'

export default {
  components: {
    MHeader: Header,
    Tab,
    Player
  },
  computed: {
    // 底部mini播放器存在时需要让容器保留底部60px
    viewStyle() {
      const bottom = this.playList.length ? '60px' : '0'
      return {
        bottom
      }
    },
    ...mapState(['playList'])
  }
}
</script>
