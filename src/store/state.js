import { PLAY_MODE, FAVORITE_KEY, SEARCH_KEY, PLAY_KEY } from '@/assets/js/constant'
import { load } from '@/assets/js/array-store'

const state = {
  // 顺序播放列表
  sequenceList: [],
  // 实际播放列表
  playList: [],
  // 是否播放中
  playing: false,
  // 播放模式
  playMode: PLAY_MODE.sequence,
  // 当前播放索引
  currentIndex: 0,
  // 播放器是否全屏
  fullScreen: false,
  // 收藏列表
  favoriteList: load(FAVORITE_KEY),
  // 搜索历史记录
  searchHistory: load(SEARCH_KEY),
  // 播放历史记录
  playHistory: load(PLAY_KEY)
}

export default state
