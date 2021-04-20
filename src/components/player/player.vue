<template>
  <div class="player" v-show="playList.length">
    <transition
      name="normal"
      @enter="enter"
      @after-enter="afterEnter"
      @leave="leave"
      @after-leave="afterLeave"
    >
      <div class="normal-player" v-show="fullScreen">
        <div class="background">
          <img :src="currentSong.pic" alt="" />
        </div>
        <div class="top">
          <div class="back" @click="goBack">
            <i class="icon-back"></i>
          </div>
          <h1 class="title">{{ currentSong.name }}</h1>
          <h2 class="subtitle">{{ currentSong.singer }}</h2>
        </div>
        <div
          class="middle"
          @touchstart.prevent="onMiddleTouchStart"
          @touchmove.prevent="onMiddleTouchMove"
          @touchend.prevent="onMiddleTouchEnd"
        >
          <div class="middle-l" :style="middleLStyle">
            <div class="cd-wrapper" ref="cdWrapperRef">
              <div class="cd" ref="cdRef">
                <img
                  ref="cdImageRef"
                  class="image"
                  :class="cdCls"
                  :src="currentSong.pic"
                  alt=""
                />
              </div>
            </div>
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric">{{ playingLyric }}</div>
            </div>
          </div>
          <scroll class="middle-r" ref="lyricScrollRef" :style="middleRStyle">
            <div class="lyric-wrapper">
              <div v-if="currentLyric" ref="lyricListRef">
                <p
                  class="text"
                  :class="{ current: currentLineNum === index }"
                  v-for="(line, index) in currentLyric.lines"
                  :key="line.num"
                >
                  {{ line.txt }}
                </p>
              </div>
              <div class="pure-music" v-show="pureMusicLyric">
                <p>{{ pureMusicLyric }}</p>
              </div>
            </div>
          </scroll>
        </div>
        <div class="bottom">
          <div class="dot-wrapper">
            <span class="dot" :class="{ active: currentShow === 'cd' }"></span>
            <span
              class="dot"
              :class="{ active: currentShow === 'lyric' }"
            ></span>
          </div>
          <div class="progress-wrapper">
            <span class="time time-l">{{ formatTime(currentTime) }}</span>
            <div class="progress-bar-wrapper">
              <progress-bar
                ref="barRef"
                :progress="progress"
                @progress-changing="onProgressChanging"
                @progress-changed="onProgressChanged"
              ></progress-bar>
            </div>
            <span class="time time-r">{{
              formatTime(currentSong.duration)
            }}</span>
          </div>
          <div class="operators">
            <div class="icon i-left">
              <i :class="modeIcon" @click="changeMode"></i>
            </div>
            <div class="icon i-left" :class="disableCls">
              <i @click="prev" class="icon-prev"></i>
            </div>
            <div class="icon i-center" :class="disableCls">
              <i @click="togglePlay" :class="playIcon"></i>
            </div>
            <div class="icon i-right" :class="disableCls">
              <i @click="next" class="icon-next"></i>
            </div>
            <div class="icon i-right">
              <i
                @click="toggleFavorite(currentSong)"
                :class="getFavoriteIcon(currentSong)"
              ></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <mini-player :progress="progress" :toggle-play="togglePlay"></mini-player>
    <audio
      ref="audioRef"
      @pause="pause"
      @canplay="ready"
      @error="error"
      @timeupdate="updateTime"
      @ended="end"
    ></audio>
  </div>
</template>

<script>
import { computed, watch, ref, nextTick } from 'vue'
import { useStore } from 'vuex'
import useMode from './use-mode'
import useCD from './use-cd'
import useFavorite from './use-favorite'
import useLyric from './use-lyric'
import useAnimation from './use-animation'
import useMiddleInteractive from './use-middle-interactive'
import { formatTime } from '@/assets/js/util'
import { PLAY_MODE } from '@/assets/js/constant'
import ProgressBar from './progress-bar'
import MiniPlayer from './mini-player'
import Scroll from '@/components/base/scroll/scroll'

// 当前进度条是否正在拖动
let progressChanging = false

export default {
  name: 'player',
  components: {
    ProgressBar,
    MiniPlayer,
    Scroll
  },
  setup() {
    // 获取vuex中保存的数据
    const store = useStore()
    // 播放器dom
    const audioRef = ref(null)
    // 进度条dom
    const barRef = ref(null)
    // 歌曲加载部分加载是否完成
    const songReady = ref(false)
    // 当前播放事件
    const currentTime = ref(0)

    // 全屏模式
    const fullScreen = computed(() => store.state.fullScreen)
    // 当前播放歌曲
    const currentSong = computed(() => store.getters.currentSong)
    // 当前播放状态
    const playing = computed(() => store.state.playing)
    // 当前播放歌曲的索引
    const currentIndex = computed(() => store.state.currentIndex)
    // 当前播放列表
    const playList = computed(() => store.state.playList)
    // 播放按钮class
    const playIcon = computed(() => {
      return playing.value ? 'icon-pause' : 'icon-play'
    })
    // 当前播放模式
    const playMode = computed(() => store.state.playMode)
    // 当前播放进度
    const progress = computed(() => {
      return currentTime.value === 0
        ? 0
        : currentTime.value / currentSong.value.duration
    })
    // 按钮禁用class
    const disableCls = computed(() => {
      return songReady.value ? '' : 'disable'
    })

    // 封装切换播放模式逻辑
    const { modeIcon, changeMode } = useMode()

    // 封装收藏逻辑
    const { getFavoriteIcon, toggleFavorite } = useFavorite()

    // 封装旋转图片逻辑
    const { cdCls, cdRef, cdImageRef } = useCD()

    // 封装cd歌词切换逻辑
    const {
      currentShow,
      middleLStyle,
      middleRStyle,
      onMiddleTouchStart,
      onMiddleTouchMove,
      onMiddleTouchEnd
    } = useMiddleInteractive()

    // 封装歌词逻辑
    const {
      currentLyric,
      currentLineNum,
      pureMusicLyric,
      playingLyric,
      playLyric,
      stopLyric,
      lyricScrollRef,
      lyricListRef
    } = useLyric({
      songReady,
      currentTime
    })

    // 封装切换全屏 - mini播放器动画逻辑
    const {
      cdWrapperRef,
      enter,
      afterEnter,
      leave,
      afterLeave
    } = useAnimation()

    // 监听当前播放歌曲
    watch(currentSong, newSong => {
      // 歌曲不存在或无法播放返回
      if (!newSong.id || !newSong.url) {
        return
      }

      currentTime.value = 0

      // 歌曲加载状态置为未完成 false
      songReady.value = false
      const audioEl = audioRef.value
      // 播放歌曲
      audioEl.src = newSong.url
      audioEl.play()
    })
    // 监听播放状态
    watch(playing, newPlaying => {
      // 加载未完成直接返回
      // 首次加载的时候这个watch中的audioEl.play()也会被执行
      // 因为歌曲加载时异步的，此时歌曲还没加载完成，所以执行audioEl.play()会报错
      // 所以增加songReady字段来表示歌曲是否加载到可以播放的程度
      if (!songReady.value) {
        return
      }
      const audioEl = audioRef.value
      // 切换播放暂停，歌词滚动跟随播放状态
      if (newPlaying) {
        audioEl.play()
        playLyric()
      } else {
        audioEl.pause()
        stopLyric()
      }
    })
    // 监听全屏播放器展示状态
    watch(fullScreen, async newFullScreen => {
      // 开启全屏播放时，更新进度条播放进度
      if (newFullScreen) {
        // dom更新后再更新播放进度
        await nextTick()
        barRef.value.setOffset(progress.value)
      }
    })

    // 收起全屏
    function goBack() {
      store.commit('setFullScreen', false)
    }
    // 切换播放状态
    function togglePlay() {
      // 未就绪时不可切换
      if (!songReady.value) return
      store.commit('setPlayingState', !playing.value)
    }
    // 暂停播放
    function pause() {
      store.commit('setPlayingState', false)
    }
    // 播放上一首歌曲
    function prev() {
      const list = playList.value
      const length = list.length
      // 无歌曲和歌曲未就绪时返回
      if (!songReady.value || !length) return
      // 播放列表只有一首歌曲时循环播放
      if (length === 1) {
        loop()
      } else {
        let index = currentIndex.value - 1
        // 边界处理 已经时第一首歌则播放列表末尾歌曲
        if (index === -1) {
          index = length - 1
        }
        // 修改当前播放歌曲索引
        store.commit('setCurrentIndex', index)
        // 在暂停状态切换歌曲则播放歌曲
        if (!playing.value) {
          store.commit('setPlayingState', true)
        }
      }
    }
    // 播放下一首歌曲
    function next() {
      const list = playList.value
      const length = list.length
      // 无歌曲和歌曲未就绪时返回
      if (!songReady.value || !length) return
      // 播放列表只有一首歌曲时循环播放
      if (length === 1) {
        loop()
      } else {
        // 当前播放歌曲索引 + 1
        let index = currentIndex.value + 1
        // 边界处理 超过播放列表则从头开始播放
        if (index === length) {
          index = 0
        }
        // 修改当前播放歌曲索引
        store.commit('setCurrentIndex', index)
        // 在暂停状态切换歌曲则播放歌曲
        if (!playing.value) {
          store.commit('setPlayingState', true)
        }
      }
    }
    // 循环播放
    function loop() {
      const audioEl = audioRef.value
      audioEl.currentTime = 0
      audioEl.play()
      store.commit('setPlayingState', true)
    }
    // 歌曲加载完成允许播放触发事件
    function ready() {
      if (songReady.value) {
        return
      }
      songReady.value = true
      playLyric()
    }
    // 歌曲加载错误触发事件，将加载状态置为结束
    function error() {
      songReady.value = true
    }
    // 播放进度事件触发
    function updateTime(e) {
      // 正在拖动进度条则不修改当前播放时间
      if (!progressChanging) {
        currentTime.value = e.target.currentTime
      }
    }
    // 播放结束时根据播放模式切换歌曲
    function end() {
      // 当前播放时间置0
      currentTime.value = 0
      if (playMode.value === PLAY_MODE.loop) {
        loop()
      } else {
        next()
      }
    }
    // 拖动歌曲进度条按钮触发事件
    function onProgressChanging(progress) {
      progressChanging = true
      currentTime.value = currentSong.value.duration * progress
      // 拖动时歌词要滚动到对应位置，但是不能自动滚动
      // 所以先用playLyric将歌词定位到对应位置，再用stopLyric暂停歌词
      playLyric()
      stopLyric()
    }
    // 进度条按钮拖动结束触发事件
    function onProgressChanged(progress) {
      progressChanging = false
      // 设置audio的当前播放时间
      audioRef.value.currentTime = currentTime.value =
        currentSong.value.duration * progress
      // 暂停状态下切换进度直接播放
      if (!playing.value) {
        store.commit('setPlayingState', true)
      }
      // 拖动结束时滚动歌词
      playLyric()
    }

    return {
      playList,
      end,
      onProgressChanging,
      onProgressChanged,
      updateTime,
      error,
      disableCls,
      ready,
      prev,
      next,
      pause,
      playIcon,
      togglePlay,
      goBack,
      audioRef,
      barRef,
      fullScreen,
      currentSong,
      progress,
      currentTime,
      formatTime,
      // useMode
      modeIcon,
      changeMode,
      // useFavorite
      getFavoriteIcon,
      toggleFavorite,
      // useCD
      cdCls,
      cdRef,
      cdImageRef,
      // useLyric
      currentLyric,
      currentLineNum,
      pureMusicLyric,
      playingLyric,
      lyricScrollRef,
      lyricListRef,
      // useMiddleInteractive
      currentShow,
      middleLStyle,
      middleRStyle,
      onMiddleTouchStart,
      onMiddleTouchMove,
      onMiddleTouchEnd,
      // useAnimation
      cdWrapperRef,
      enter,
      afterEnter,
      leave,
      afterLeave
    }
  }
}
</script>

<style lang="scss" scoped>
.player {
  .normal-player {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 150;
    background: $color-background;
    .background {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      opacity: 0.6;
      filter: blur(20px);

      img {
        width: 100%;
        height: 100%;
      }
    }
    .top {
      position: relative;
      margin-bottom: 25px;
      .back {
        position: absolute;
        top: 0;
        left: 6px;
        z-index: 50;
      }
      .icon-back {
        display: block;
        padding: 9px;
        font-size: $font-size-large-x;
        color: $color-theme;
        transform: rotate(-90deg);
      }
      .title {
        width: 70%;
        margin: 0 auto;
        line-height: 40px;
        text-align: center;
        @include no-wrap();
        font-size: $font-size-large;
        color: $color-text;
      }
      .subtitle {
        line-height: 20px;
        text-align: center;
        font-size: $font-size-medium;
        color: $color-text;
      }
    }
    .middle {
      position: fixed;
      width: 100%;
      top: 80px;
      bottom: 170px;
      white-space: nowrap;
      font-size: 0;
      .middle-l {
        display: inline-block;
        vertical-align: top;
        position: relative;
        width: 100%;
        height: 0;
        padding-top: 80%;
        .cd-wrapper {
          position: absolute;
          left: 10%;
          top: 0;
          width: 80%;
          box-sizing: border-box;
          height: 100%;
          .cd {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            img {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              height: 100%;
              box-sizing: border-box;
              border-radius: 50%;
              border: 10px solid rgba(255, 255, 255, 0.1);
            }
            .playing {
              animation: rotate 20s linear infinite;
            }
          }
        }
        .playing-lyric-wrapper {
          width: 80%;
          margin: 30px auto 0 auto;
          overflow: hidden;
          text-align: center;
          .playing-lyric {
            height: 20px;
            line-height: 20px;
            font-size: $font-size-medium;
            color: $color-text-l;
          }
        }
      }
      .middle-r {
        display: inline-block;
        vertical-align: top;
        width: 100%;
        height: 100%;
        overflow: hidden;
        .lyric-wrapper {
          width: 80%;
          margin: 0 auto;
          overflow: hidden;
          text-align: center;
          .text {
            line-height: 32px;
            color: $color-text-l;
            font-size: $font-size-medium;
            &.current {
              color: $color-text;
            }
          }
          .pure-music {
            padding-top: 50%;
            line-height: 32px;
            color: $color-text-l;
            font-size: $font-size-medium;
          }
        }
      }
    }
    .bottom {
      position: absolute;
      bottom: 50px;
      width: 100%;
      .dot-wrapper {
        text-align: center;
        font-size: 0;
        .dot {
          display: inline-block;
          vertical-align: middle;
          margin: 0 4px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: $color-text-l;
          &.active {
            width: 20px;
            border-radius: 5px;
            background: $color-text-ll;
          }
        }
      }
      .progress-wrapper {
        display: flex;
        align-items: center;
        width: 80%;
        margin: 0px auto;
        padding: 10px 0;
        .time {
          color: $color-text;
          font-size: $font-size-small;
          flex: 0 0 40px;
          line-height: 30px;
          width: 40px;
          &.time-l {
            text-align: left;
          }
          &.time-r {
            text-align: right;
          }
        }
        .progress-bar-wrapper {
          flex: 1;
        }
      }
      .operators {
        display: flex;
        align-items: center;
        .icon {
          flex: 1;
          color: $color-theme;
          &.disable {
            color: $color-theme-d;
          }
          i {
            font-size: 30px;
          }
        }
        .i-left {
          text-align: right;
        }
        .i-center {
          padding: 0 20px;
          text-align: center;
          i {
            font-size: 40px;
          }
        }
        .i-right {
          text-align: left;
        }
        .icon-favorite {
          color: $color-sub-theme;
        }
      }
    }
    &.normal-enter-active,
    &.normal-leave-active {
      transition: all 0.6s;
      .top,
      .bottom {
        transition: all 0.6s cubic-bezier(0.45, 0, 0.55, 1);
      }
    }
    &.normal-enter-from,
    &.normal-leave-to {
      opacity: 0;
      .top {
        transform: translate3d(0, -100px, 0);
      }
      .bottom {
        transform: translate3d(0, 100px, 0);
      }
    }
  }
}
</style>
