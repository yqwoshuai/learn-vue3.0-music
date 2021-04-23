import MusicList from '@/components/music-list/music-list'
import { processSongs } from '@/service/songs'
import storage from 'good-storage'

// 封装歌曲列表逻辑
export default function createDetailComponent(name, key, fetch) {
  return {
    name,
    components: {
      MusicList
    },
    props: {
      data: Object
    },
    data() {
      return {
        songs: [],
        loading: true
      }
    },
    computed: {
      computedData() {
        // 从会话缓存中获取歌手数据
        let ret = null
        const data = this.data
        if (data) {
          ret = data
        } else {
          const cached = storage.session.get(key)
          // 会话缓存中id与当前页面id一致则读取会话缓存
          if (
            cached &&
            (cached.mid || cached.id + '') === this.$route.params.id
          ) {
            ret = cached
          }
        }
        return ret
      },
      pic() {
        const data = this.computedData
        return data && data.pic
      },
      title() {
        const data = this.computedData
        return data && (data.name || data.title)
      }
    },
    async created() {
      const data = this.computedData
      // 无数据时直接退回上级路由
      if (!data) {
        const path = this.$route.matched[0].path
        this.$router.push({
          path
        })
        return
      }
      // 获取歌手详情页数据
      const result = await fetch(data)
      this.songs = await processSongs(result.songs)
      this.loading = false
    }
  }
}
