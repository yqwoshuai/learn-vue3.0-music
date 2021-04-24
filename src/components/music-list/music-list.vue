<template>
  <div class="music-list">
    <div class="back">
      <i class="icon-back" @click="goBack"></i>
    </div>
    <h1 class="title">{{ title }}</h1>
    <div class="bg-image" :style="bgImageStyle" ref="bgImgRef">
      <div class="play-btn-wrapper" :style="playBtnStyle">
        <div v-show="songs.length > 0" class="play-btn" @click="random">
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
      <div class="filter" :style="filterStyle"></div>
    </div>
    <scroll
      class="list"
      :style="scrollStyle"
      v-loading="loading"
      v-no-result:[noResultText]="noResult"
      :probe-type="3"
      @scroll="onScroll"
    >
      <div class="song-list-wrapper">
        <song-list :songs="songs" @select="selectItem" :rank="rank"></song-list>
      </div>
    </scroll>
  </div>
</template>

<script>
import Scroll from '@/components/wrap-scroll'
import SongList from '@/components/base/song-list/song-list'
import { mapActions } from 'vuex'
import useStyle from './use-style'

export default {
  name: 'music-list',
  components: {
    Scroll,
    SongList
  },
  props: {
    songs: {
      type: Array,
      default() {
        return []
      }
    },
    title: String,
    pic: String,
    loading: Boolean,
    noResultText: {
      type: String,
      default: '抱歉，没有找到可播放的歌曲'
    },
    rank: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    // 返回
    goBack() {
      this.$router.back()
    },
    // 顺序播放
    selectItem({ song, index }) {
      this.selectPlay({ list: this.songs, index })
    },
    // 随机播放
    random() {
      this.randomPlay(this.songs)
    },
    ...mapActions(['selectPlay', 'randomPlay'])
  },
  computed: {
    // 没有歌曲时显示无结果组件
    noResult() {
      return !this.loading && !this.songs.length
    }
  },
  setup(props) {
    // 封装动态样式逻辑
    const {
      bgImgRef,
      onScroll,
      filterStyle,
      scrollStyle,
      bgImageStyle,
      playBtnStyle
    } = useStyle(props)

    return {
      bgImgRef,
      onScroll,
      filterStyle,
      scrollStyle,
      bgImageStyle,
      playBtnStyle
    }
  }
}
</script>

<style lang="scss" scoped>
.music-list {
  position: relative;
  height: 100%;
  .back {
    position: absolute;
    top: 0;
    left: 6px;
    z-index: 20;
    transform: translateZ(2px);
    .icon-back {
      display: block;
      padding: 10px;
      font-size: $font-size-large-x;
      color: $color-theme;
    }
  }
  .title {
    position: absolute;
    top: 0;
    left: 10%;
    width: 80%;
    z-index: 20;
    transform: translateZ(2px);
    @include no-wrap();
    text-align: center;
    line-height: 40px;
    font-size: $font-size-large;
    color: $color-text;
  }
  .bg-image {
    position: relative;
    width: 100%;
    transform-origin: top;
    background-size: cover;
    .play-btn-wrapper {
      position: absolute;
      bottom: 20px;
      z-index: 10;
      width: 100%;
      .play-btn {
        box-sizing: border-box;
        width: 135px;
        padding: 7px 0;
        margin: 0 auto;
        text-align: center;
        border: 1px solid $color-theme;
        color: $color-theme;
        border-radius: 100px;
        font-size: 0;
      }
      .icon-play {
        display: inline-block;
        vertical-align: middle;
        margin-right: 6px;
        font-size: $font-size-medium-x;
      }
      .text {
        display: inline-block;
        vertical-align: middle;
        font-size: $font-size-small;
      }
    }
    .filter {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(7, 17, 27, 0.4);
    }
  }
  .list {
    position: absolute;
    bottom: 0;
    width: 100%;
    z-index: 0;
    .song-list-wrapper {
      padding: 20px 30px;
      background: $color-background;
    }
  }
}
</style>
