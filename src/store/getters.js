// 当前播放的歌曲
export const currentSong = state => {
  return state.playList[state.currentIndex]
}
