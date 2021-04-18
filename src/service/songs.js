import { get } from './base'

// 获取歌曲播放链接
export function processSongs(songs) {
  if (!songs.length) {
    return Promise.resolve(songs)
  }

  return get('/api/getSongsUrl', {
    mid: songs.map(song => {
      return song.mid
    })
  }).then(result => {
    const map = result.map
    return songs
      .map(song => {
        song.url = map[song.mid]
        return song
      })
      .filter(song => {
        return song.url.indexOf('vkey') > -1
      })
  })
}

// 获取歌词，定义一个对象缓存已经获取的歌词
const lyricMap = {}
export function getLyric(song) {
  // 当前播放的歌曲已经有歌词了，直接用promise包装一下返回
  if (song.lyric) {
    return Promise.resolve(song.lyric)
  }
  // mid相同的歌曲直接从缓存中读取歌词
  const mid = song.mid
  const lyric = lyricMap[mid]
  if (lyric) {
    return Promise.resolve(lyric)
  }

  return get('/api/getLyric', {
    mid
  }).then(result => {
    // 处理歌词不存在情况
    const lyric = result ? result.lyric : '[00:00:00]该歌曲暂时无法获取歌词'
    // 缓存歌词
    lyricMap[mid] = lyric
    return lyric
  })
}
