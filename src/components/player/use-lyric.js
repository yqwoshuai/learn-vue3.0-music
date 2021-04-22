import { computed, watch, ref } from 'vue'
import { useStore } from 'vuex'
import { getLyric } from '@/service/songs'
import LyricParser from 'lyric-parser'

export default function useLyric({ songReady, currentTime }) {
  const store = useStore()
  // 当前歌词实例，包含歌词的数据和操做歌词的各种方法
  const currentLyric = ref(null)
  // 当前歌词的行数
  const currentLineNum = ref(0)
  // 纯音乐歌曲显示文案
  const pureMusicLyric = ref('')
  // 当前本句歌词文案
  const playingLyric = ref('')
  // 歌词容器dom
  const lyricScrollRef = ref(null)
  // 歌词列表dom
  const lyricListRef = ref(null)
  // 获取当前播放歌曲
  const currentSong = computed(() => store.getters.currentSong)
  // 监听播放歌曲变化，异步获取歌词
  watch(currentSong, async newSong => {
    if (!newSong.url || !newSong.id) {
      return
    }
    // 停止当前正在滚动的歌词
    stopLyric()
    // 清除当前歌词实例
    currentLyric.value = null
    // 初始化歌词相关数据
    currentLineNum.value = 0
    pureMusicLyric.value = ''
    playingLyric.value = ''
    // 获取歌词
    const lyric = await getLyric(newSong)
    // 给播放列表中的对应歌曲添加歌词，后续可以直接从歌曲本身的数据中取，不用再次发起请求
    store.commit('addSongLyric', {
      song: newSong,
      lyric
    })
    // 歌词是异步获取的，快速切换歌曲可能会导致歌词与歌曲不匹配
    if (currentSong.value.lyric !== lyric) {
      return
    }
    // 创建歌词实例
    currentLyric.value = new LyricParser(lyric, handleLyric)
    const hasLyric = currentLyric.value.lines.length
    // 歌词数据
    if (hasLyric) {
      // 歌曲准备好可以播放时才滚动歌词
      if (songReady.value) {
        playLyric()
      }
    } else {
      // 删除歌词前面的时间，显示固定的歌词
      playingLyric.value = pureMusicLyric.value = lyric.replace(
        /\[(\d{2}):(\d{2}):(\d{2})\]/g,
        ''
      )
    }
  })

  // 歌词执行滚动
  function playLyric() {
    const currentLyricVal = currentLyric.value
    if (currentLyricVal) {
      // 传入当前播放时间，获取对应歌词
      currentLyricVal.seek(currentTime.value * 1000)
    }
  }

  // 停止歌词滚动
  function stopLyric() {
    const currentLyricVal = currentLyric.value
    if (currentLyricVal) {
      currentLyricVal.stop()
    }
  }

  function handleLyric({ lineNum, txt }) {
    // 获取当前本句歌词的行数
    currentLineNum.value = lineNum
    // 获取本句歌词文本
    playingLyric.value = txt
    // 获取对应dom，执行滚动
    const scrollComp = lyricScrollRef.value
    const listEl = lyricListRef.value
    if (!listEl) {
      return
    }
    // 从第5句歌词开始，使用scroll组件滚动，保持当前本句歌词在中间
    if (lineNum > 5) {
      const lineEl = listEl.children[lineNum - 5]
      scrollComp.scroll.scrollToElement(lineEl, 1000)
    } else {
      scrollComp.scroll.scrollTo(0, 0, 1000)
    }
  }

  return {
    currentLyric,
    pureMusicLyric,
    playingLyric,
    currentLineNum,
    playLyric,
    stopLyric,
    lyricScrollRef,
    lyricListRef
  }
}
