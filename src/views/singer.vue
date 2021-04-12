<template>
  <div class="singer" v-loading="!singers.length">
    <index-list :data="singers" @select="selectSinger"></index-list>
    <router-view :singer="selectedSinger"></router-view>
  </div>
</template>

<script>
import { getSingerList } from '@/service/singer'
import IndexList from '@/components/base/index-list/index-list'

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
      this.$router.push({
        path: `/singer/${singer.mid}`
      })
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
