<template>
  <div class="search">
    <div class="search-input-wrapper">
      <search-input v-model="query"></search-input>
    </div>
    <scroll ref="scrollRef" class="search-content" v-show="!query">
      <div>
        <div class="hot-keys">
          <h1 class="title">热门搜索</h1>
          <ul>
            <li
              class="item"
              v-for="item in hotKeys"
              :key="item.id"
              @click="addQuery(item.key)"
            >
              <span>{{ item.key }}</span>
            </li>
          </ul>
        </div>
        <div class="search-history" v-show="searchHistory.length">
          <h1 class="title">
            <span class="text">搜索历史</span>
            <span class="clear" @click="showConfirm">
              <i class="icon-clear"></i>
            </span>
          </h1>
          <confirm
            ref="confirmRef"
            text="是否清空所有搜索历史"
            confirm-btn-text="清空"
            @confirm="clearSearch"
          ></confirm>
          <search-list
            :searches="searchHistory"
            @select="addQuery"
            @delete="deleteSearch"
          ></search-list>
        </div>
      </div>
    </scroll>
    <div class="search-result" v-show="query">
      <suggest
        :query="query"
        @select-song="selectSong"
        @select-singer="selectSinger"
      ></suggest>
    </div>
    <router-view v-slot="{ Component }">
      <transition appear name="slide">
        <component :is="Component" :data="selectedSinger" />
      </transition>
    </router-view>
  </div>
</template>

<script>
import { ref, computed, watch, nextTick } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import storage from 'good-storage'
import SearchInput from '@/components/search/search-input'
import Suggest from '@/components/search/suggest'
import SearchList from '@/components/base/search-list/search-list'
import Confirm from '@/components/base/confirm/confirm'
import useSearchHistory from '@/components/search/use-search-history'
import Scroll from '@/components/wrap-scroll'
import { getHotKeys } from '@/service/search'
import { SINGER_KEY } from '@/assets/js/constant'

export default {
  name: 'search',
  components: { SearchInput, Suggest, SearchList, Scroll, Confirm },
  setup() {
    const store = useStore()
    const router = useRouter()
    // 搜索参数
    const query = ref('')
    // 热门搜索
    const hotKeys = ref([])
    // 歌手信息
    const selectedSinger = ref(null)
    // 滚动组件
    const scrollRef = ref(null)
    // 弹框组件
    const confirmRef = ref(null)
    // 搜索历史记录
    const searchHistory = computed(() => store.state.searchHistory)
    // 封装操作历史搜索记录逻辑
    const { saveSearch, deleteSearch, clearSearch } = useSearchHistory()

    // 获取热门搜索数据
    getHotKeys().then(result => {
      hotKeys.value = result.hotKeys
    })
    // 监听搜索内容变化，清空搜索内容时刷新滚动组件
    watch(query, async newQuery => {
      if (!newQuery) {
        await nextTick()
        refreshScroll()
      }
    })
    // 刷新滚动组件
    function refreshScroll() {
      scrollRef.value.scroll.refresh()
    }

    // 查询热门搜索内容
    function addQuery(s) {
      query.value = s
    }

    // 添加歌曲
    function selectSong(song) {
      saveSearch(query.value)
      store.dispatch('addSong', song)
    }
    // 选择歌手，跳转歌手二级页面
    function selectSinger(singer) {
      saveSearch(query.value)
      selectedSinger.value = singer
      cacheSinger(singer)
      router.push({
        path: `/search/${singer.mid}`
      })
    }
    // 缓存歌手信息
    function cacheSinger(singer) {
      storage.session.set(SINGER_KEY, singer)
    }
    // 打开确认组件
    function showConfirm() {
      confirmRef.value.show()
    }

    return {
      query,
      hotKeys,
      addQuery,
      selectSong,
      selectSinger,
      selectedSinger,
      searchHistory,
      scrollRef,
      confirmRef,
      showConfirm,
      // useSearchHistory
      deleteSearch,
      clearSearch
    }
  }
}
</script>

<style lang="scss" scoped>
.search {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
  display: flex;
  flex-direction: column;
  .search-input-wrapper {
    margin: 20px;
  }
  .search-content {
    flex: 1;
    overflow: hidden;
    .hot-keys {
      margin: 0 20px 20px 20px;
      .title {
        margin-bottom: 20px;
        font-size: $font-size-medium;
        color: $color-text-l;
      }
      .item {
        display: inline-block;
        padding: 5px 10px;
        margin: 0 20px 10px 0;
        border-radius: 6px;
        background: $color-highlight-background;
        font-size: $font-size-medium;
        color: $color-text-d;
      }
    }
    .search-history {
      position: relative;
      margin: 0 20px;
      .title {
        display: flex;
        align-items: center;
        height: 40px;
        font-size: $font-size-medium;
        color: $color-text-l;
        .text {
          flex: 1;
        }
        .clear {
          @include extend-click();
          .icon-clear {
            font-size: $font-size-medium;
            color: $color-text-d;
          }
        }
      }
    }
  }
  .search-result {
    flex: 1;
    overflow: hidden;
  }
}
</style>
