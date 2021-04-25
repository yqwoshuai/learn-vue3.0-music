<template>
  <div
    ref="rootRef"
    class="suggest"
    v-loading:[loadingText]="loading"
    v-no-result:[noResultText]="noResult"
  >
    <ul class="suggest-list">
      <li class="suggest-item" v-if="singer">
        <div class="icon">
          <i class="icon-mine"></i>
        </div>
        <div class="name">
          <p class="text">{{ singer.name }}</p>
        </div>
      </li>
      <li class="suggest-item" v-for="song in songs" :key="song.id">
        <div class="icon">
          <i class="icon-music"></i>
        </div>
        <div class="name">
          <p class="text">{{ song.singer }}-{{ song.name }}</p>
        </div>
      </li>
      <div class="suggest-item" v-loading:[loadingText]="pullUpLoading"></div>
    </ul>
  </div>
</template>

<script>
import { computed, nextTick, ref, watch } from 'vue'
import { search } from '@/service/search'
import { processSongs } from '@/service/songs'
import usePullUpLoad from './use-pull-up-load'

export default {
  name: 'suggest',
  props: {
    query: String,
    showSinger: {
      type: Boolean,
      default: true
    }
  },
  setup(props) {
    const singer = ref(null)
    const songs = ref([])
    const hasMore = ref(true)
    const page = ref(1)
    const loadingText = ref('')
    const noResultText = ref('抱歉，暂无搜索结果')

    const { rootRef, isPullUpLoad, scroll } = usePullUpLoad(searchMore)

    // 是否正在加载
    const loading = computed(() => {
      return !singer.value && !songs.value.length
    })
    // 加载完成是否有结果数据
    const noResult = computed(() => {
      return !singer.value && !songs.value.length && !hasMore.value
    })
    // 是否正在上拉加载
    const pullUpLoading = computed(() => {
      return isPullUpLoad.value && hasMore.value
    })

    // 监听搜索内容
    watch(
      () => props.query,
      async newQuery => {
        // 搜索内容为空不执行搜索
        if (!newQuery) {
          return
        }
        await searchFirst()
      }
    )
    // 查询搜索
    async function searchFirst() {
      if (!props.query) {
        return
      }
      // 清空前一次数据
      page.value = 1
      songs.value = []
      singer.value = null
      hasMore.value = true
      // 获取结果
      const result = await search(props.query, page.value, props.showSinger)
      songs.value = await processSongs(result.songs)
      singer.value = result.singer
      hasMore.value = result.hasMore
      await nextTick()
      await makeItScrollable()
    }
    // 分页查询
    async function searchMore() {
      if (!hasMore.value || !props.query) {
        return
      }
      // 页码递增查询数据
      page.value++
      const result = await search(props.query, page.value, props.showSinger)
      songs.value = songs.value.concat(await processSongs(result.songs))
      hasMore.value = result.hasMore
      // 单页数据不满一屏时继续加载下一页数据
      await nextTick()
      await makeItScrollable()
    }
    // 单页数据不满一屏时继续加载下一页数据
    async function makeItScrollable() {
      if (scroll.value.maxScrollY >= -1) {
        await searchMore()
      }
    }

    return {
      singer,
      songs,
      loadingText,
      noResult,
      loading,
      noResultText,
      // usePullUpLoad
      rootRef,
      pullUpLoading
    }
  }
}
</script>

<style lang="scss" scoped>
.suggest {
  height: 100%;
  overflow: hidden;
  .suggest-list {
    padding: 0 30px;
    .suggest-item {
      display: flex;
      align-items: center;
      padding-bottom: 20px;
      .icon {
        flex: 0 0 30px;
        width: 30px;
        [class^='icon-'] {
          font-size: 14px;
          color: $color-text-d;
        }
      }
      .name {
        flex: 1;
        font-size: $font-size-medium;
        color: $color-text-d;
        overflow: hidden;
        .text {
          @include no-wrap();
        }
      }
    }
  }
}
</style>
