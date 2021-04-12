<template>
  <div class="music-list">
    <div class="back">
      <i class="icon-back" @click="goBack"></i>
    </div>
    <h1 class="title">{{ title }}</h1>
    <div class="bg-image" :style="bgImageStyle" ref="bgImage">
      <div class="filter" :style="filterStyle"></div>
    </div>
    <scroll
      class="list"
      :style="scrollStyle"
      v-loading="loading"
      :probe-type="3"
      @scroll="onScroll"
    >
      <div class="song-list-wrapper">
        <song-list :songs="songs"></song-list>
      </div>
    </scroll>
  </div>
</template>

<script>
import Scroll from '@/components/base/scroll/scroll'
import SongList from '@/components/base/song-list/song-list'

// 滚动到顶部时，顶部的图片覆盖距离
const RESERVED_HEIGHT = 40

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
    loading: Boolean
  },
  data() {
    return {
      imageHeight: 0, // 图片高度
      scrollY: 0, // 滚动高度
      maxTranslateY: 0 // 向上滚动的零界点
    }
  },
  computed: {
    // 根据滚动计算顶部图片的样式
    bgImageStyle() {
      const scrollY = this.scrollY
      let zIndex = 0
      // 固定宽高比
      let paddingTop = '70%'
      let height = 0
      // 处理ios兼容问题
      let translateZ = 0

      // 向上滚动歌曲列表时，超过零界点，则让图片覆盖歌曲列表，留出顶部一段高度不会被歌曲列表覆盖
      if (scrollY > this.maxTranslateY) {
        zIndex = 10
        paddingTop = 0
        height = `${RESERVED_HEIGHT}px`
        translateZ = 1
      }

      // 下拉歌曲列表时图片放大效果
      let scale = 1
      if (scrollY < 0) {
        scale = 1 + Math.abs(scrollY / this.imageHeight)
      }

      return {
        zIndex,
        paddingTop,
        height,
        transform: `scale(${scale}) translateZ(${translateZ}px)`,
        backgroundImage: `url(${this.pic})`
      }
    },
    // 计算初始歌曲列表顶部偏移量，会等于图片的高度
    scrollStyle() {
      return {
        top: `${this.imageHeight}px`
      }
    },
    // 根据滚动高度计算蒙层模糊样式
    filterStyle() {
      let blur = 0
      const scrollY = this.scrollY
      const imageHeight = this.imageHeight
      // 向上滚动时触发模糊
      if (scrollY >= 0) {
        blur =
          Math.min(this.maxTranslateY / imageHeight, scrollY / imageHeight) * 10
      }
      return {
        backdropFilter: `blur(${blur}px)`
      }
    }
  },
  mounted() {
    // 获取图片dom的高度
    this.imageHeight = this.$refs.bgImage.clientHeight
    // 获取最多可以滚动
    this.maxTranslateY = this.imageHeight - RESERVED_HEIGHT
    console.log(this.maxTranslateY)
  },
  methods: {
    goBack() {
      this.$router.back()
    },
    // 滚动事件获取滚动距离
    onScroll(pos) {
      console.log(pos.y)
      // better-scroll向上滚动是负值，所以取负为正值
      this.scrollY = -pos.y
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
