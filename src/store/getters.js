// 当前播放的歌曲，点击列表中的歌曲会修改playList和currentIndex
// currentSong就会被重新计算
export const currentSong = state => {
  return state.playList[state.currentIndex] || {}
}
