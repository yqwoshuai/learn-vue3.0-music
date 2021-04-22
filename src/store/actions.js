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

// 执行删除歌曲
export function removeSong({ commit, state }, song) {
  // 获取播放列表副本
  const sequenceList = state.sequenceList.slice()
  const playList = state.playList.slice()
  // 找到当前歌曲索引
  const sequenceIndex = findIndex(sequenceList, song)
  const playIndex = findIndex(playList, song)

  if (sequenceIndex < 0 || playIndex < 0) {
    return
  }

  // 删除当前歌曲
  sequenceList.splice(sequenceIndex, 1)
  playList.splice(playIndex, 1)
  // 修改当前currentIndex
  let currentIndex = state.currentIndex
  // 删除当前播放歌曲之前的歌曲，或者当前播放歌曲是最后一首时，需要currentIndex - 1
  if (playIndex < currentIndex || currentIndex === playList.length) {
    currentIndex--
  }
  commit('setCurrentIndex', currentIndex)
  commit('setSequenceList', sequenceList)
  commit('setPlayList', playList)
  // 列表无歌曲时停止播放
  if (!playList.length) {
    commit('setPlayingState', false)
  }
}

// 执行清空播放列表
export function clearSongList({ commit }) {
  commit('setCurrentIndex', 0)
  commit('setSequenceList', [])
  commit('setPlayList', [])
  // 停止播放歌曲
  commit('setPlayingState', false)
}

// 找到song在列表中的索引
function findIndex(list, song) {
  return list.findIndex(item => {
    return item.id === song.id
  })
}
