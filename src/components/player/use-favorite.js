import { computed } from 'vue'
import { useStore } from 'vuex'
import { save, remove } from '@/assets/js/array-store'
import { FAVORITE_KEY, FAVORITE_MAXLEN } from '@/assets/js/constant'

export default function useFavorite() {
  const store = useStore()
  // 当前收藏列表
  const favoriteList = computed(() => store.state.favoriteList)
  // 收藏按钮样式
  function getFavoriteIcon(song) {
    return isFavorite(song) ? 'icon-favorite' : 'icon-not-favorite'
  }
  // 切换收藏
  function toggleFavorite(song) {
    let list
    if (isFavorite(song)) {
      // 移除收藏
      list = remove(FAVORITE_KEY, compare)
    } else {
      // 添加收藏
      list = save(song, FAVORITE_KEY, compare, FAVORITE_MAXLEN)
    }
    store.commit('setFavoriteList', list)
    // 移除和添加收藏的判断方法
    function compare(item) {
      return item.id === song.id
    }
  }

  // 是否是收藏歌曲
  function isFavorite(song) {
    return favoriteList.value.findIndex(item => item.id === song.id) > -1
  }

  return {
    getFavoriteIcon,
    toggleFavorite
  }
}
