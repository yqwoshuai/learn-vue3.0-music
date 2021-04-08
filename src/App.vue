<template>
  <m-header></m-header>
  <tab></tab>
  <router-view></router-view>
</template>
<script>
import Header from '@/components/header/header'
import Tab from './components/tab/tab.vue'

export default {
  components: {
    MHeader: Header,
    Tab
  }
}
</script>
