import {
  h,
  mergeProps,
  withCtx,
  renderSlot,
  ref,
  computed,
  watch,
  nextTick
} from 'vue'
import Scroll from '@/components/base/scroll/scroll'
import { useStore } from 'vuex'

export default {
  name: 'wrap-scroll',
  props: Scroll.props,
  emits: Scroll.emits,
  // 使用render函数替换模板
  render(ctx) {
    return h(
      Scroll,
      mergeProps(
        {
          ref: 'scrollRef'
        },
        ctx.$props,
        {
          onScroll: e => {
            ctx.$emit('scroll', e)
          }
        }
      ),
      // 插槽内容
      {
        default: withCtx(() => {
          return [renderSlot(ctx.$slots, 'default')]
        })
      }
    )
  },
  setup() {
    const scrollRef = ref(null)
    const scroll = computed(() => {
      return scrollRef.value.scroll
    })
    const store = useStore()
    const playList = computed(() => store.state.playList)

    // 播放列表发生变化时刷bs实例
    watch(playList, async () => {
      await nextTick()
      scroll.value.refresh()
    })

    return {
      scrollRef,
      // scroll实例也要返回，外部需要引用
      scroll
    }
  }
}
