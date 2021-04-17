import { computed, ref, watch } from 'vue'
import { useStore } from 'vuex'

export default function useCD() {
  const cdRef = ref(null)
  const cdImageRef = ref(null)
  const store = useStore()
  const playing = computed(() => store.state.playing)

  const cdCls = computed(() => {
    return playing.value ? 'playing' : ''
  })

  watch(playing, newPlaying => {
    if (!newPlaying) {
      console.log(1)
      syncTransform(cdRef.value, cdImageRef.value)
    }
  })

  function syncTransform(wrapper, inner) {
    const innerTransform = getComputedStyle(inner).transform
    const wrapperTransform = getComputedStyle(wrapper).transform
    wrapper.style.transform =
      wrapperTransform === 'none'
        ? innerTransform
        : `${innerTransform} ${wrapperTransform}`
  }

  return {
    cdCls,
    cdRef,
    cdImageRef
  }
}
