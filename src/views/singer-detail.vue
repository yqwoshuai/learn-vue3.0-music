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
    pic() {
      return this.singer && this.singer.pic
    },
    title() {
      return this.singer && this.singer.name
    }
  },
  async created() {
    // 获取歌手详情页数据
    const result = await getSingerDetail(this.singer)
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
