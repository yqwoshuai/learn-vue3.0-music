<template>
  <div class="singer" v-loading="!singers.length">
    <index-list :data="singers" @select="selectSinger"></index-list>
    <router-view v-slot="{ Component }">
      <transition appear name="slide">
        <component :is="Component" :data="selectedSinger" />
      </transition>
    </router-view>
  </div>
</template>

<script>
import { getSingerList } from '@/service/singer'
import IndexList from '@/components/index-list/index-list'
import storage from 'good-storage'
import { SINGER_KEY } from '@/assets/js/constant'

export default {
  name: 'singer',
  components: {
    IndexList
  },
  data() { 
    return {
      singers: [],
      // 当前选择的歌手详情
      selectedSinger: null
    }
  },
  async created() {
    // 获取歌手列表数据
    const result = await getSingerList()
    this.singers = result.singers
  },
  methods: {
    // 跳转歌手详情页，是歌手列表页的子路由
    selectSinger(singer) {
      this.selectedSinger = singer
      // 保存结果到会话缓存中，让二级页面刷新时能直接读取会话缓存中的数据
      this.cacheSinger(singer)
      this.$router.push({
        path: `/singer/${singer.mid}`
      })
    },
    cacheSinger(singer) {
      storage.session.set(SINGER_KEY, singer)
    }
  }
}
</script>

<style lang="scss" scoped>
.singer {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
}
</style>
