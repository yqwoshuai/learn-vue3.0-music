import { PLAY_MODE } from '@/assets/js/constant'
import shuffle from '@/assets/js/util'

// 执行顺序播放
export function selectPlay({ commit }, { list, index }) {
  commit('setPlayMode', PLAY_MODE.sequence)
  commit('setSequenceList', list)
  commit('setPlayingState', true)
  commit('setFullScreen', true)
  commit('setPlayList', list)
  commit('setCurrentIndex', index)
}

// 执行随机播放
export function randomPlay({ commit }, list) {
  commit('setPlayMode', PLAY_MODE.random)
  commit('setSequenceList', list)
  commit('setPlayingState', true)
  commit('setFullScreen', true)
  commit('setPlayList', shuffle(list))
  commit('setCurrentIndex', 0)
}

// 执行切换播放模式
export function changeMode({ commit, state, getters }, mode) {
  // 切换前保存当前播放歌曲的id，因为切换会修改当前播放list
  // 当前播放索引没有变化导致对应的歌曲变化
  const currentId = getters.currentSong.id
  // 随机模式洗牌播放列表
  if (mode === PLAY_MODE.random) {
    commit('setPlayList', shuffle(state.sequenceList))
  } else {
    commit('setPlayList', state.sequenceList)
  }
  // 找到之前歌曲对应的新index
  const index = state.playList.findIndex(song => {
    return song.id === currentId
  })
  commit('setCurrentIndex', index)
  commit('setPlayMode', mode)
}
