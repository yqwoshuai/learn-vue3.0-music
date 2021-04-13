<template>
  <div class="singer-detail">
    <musicList
      :songs="songs"
      :pic="pic"
      :title="title"
      :loading="loading"
    ></musicList>
  </div>
</template>

<script>
import { getSingerDetail } from '@/service/singer'
import { processSongs } from '@/service/songs'
import storage from 'good-storage'
import { SINGER_KEY } from '@/assets/js/constant'

import MusicList from '@/components/music-list/music-list'

export default {
  name: 'singer-detail',
  components: {
    MusicList
  },
  props: {
    singer: Object
  },
  data() {
    return {
      songs: [],
      loading: true
    }
  },
  computed: {
    computedSinger() {
      // 从会话缓存中获取歌手数据
      let ret = null
      const singer = this.singer
      if (singer) {
        ret = singer
      } else {
        const cachedSinger = storage.session.get(SINGER_KEY)
        // 会话缓存中id与当前页面id一致则读取会话缓存
        if (cachedSinger && cachedSinger.mid === this.$route.params.id) {
          ret = cachedSinger
        }
      }
      return ret
    },
    pic() {
      const singer = this.computedSinger
      return singer && singer.pic
    },
    title() {
      const singer = this.computedSinger
      return singer && singer.name
    }
  },
  async created() {
    // 无数据时直接退回上级路由
    if (!this.computedSinger) {
      const path = this.$route.matched[0].path
      this.$router.push({
        path
      })
      return
    }
    // 获取歌手详情页数据
    const result = await getSingerDetail(this.computedSinger)
    this.songs = await processSongs(result.songs)
    this.loading = false
  }
}
</script>

<style lang="scss" scoped>
.singer-detail {
  position: fixed;
  z-index: 10;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: $color-background;
}
</style>
