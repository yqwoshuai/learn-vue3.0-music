import { createRouter, createWebHashHistory } from 'vue-router'
const Recommend = () =>
  import('@/views/recommend' /* webpackChunkName: "Recommend" */)
const Singer = () => import('@/views/singer' /* webpackChunkName: "Singer" */)
const TopList = () =>
  import('@/views/top-list' /* webpackChunkName: "TopList" */)
const Search = () => import('@/views/search' /* webpackChunkName: "Search" */)
const SingerDetail = () =>
  import('@/views/singer-detail' /* webpackChunkName: "SingerDetail" */)
const TopDetail = () =>
  import('@/views/top-detail' /* webpackChunkName: "TopDetail" */)
const Album = () => import('@/views/album' /* webpackChunkName: "Album" */)
const UserCenter = () =>
  import('@/views/user-center' /* webpackChunkName: "UserCenter" */)

const routes = [
  {
    path: '/',
    redirect: '/recommend'
  },
  {
    path: '/recommend',
    component: Recommend,
    children: [
      {
        path: ':id',
        component: Album
      }
    ]
  },
  {
    path: '/singer',
    component: Singer,
    children: [
      {
        path: ':id',
        component: SingerDetail
      }
    ]
  },
  {
    path: '/top-list',
    component: TopList,
    children: [
      {
        path: ':id',
        component: TopDetail
      }
    ]
  },
  {
    path: '/search',
    component: Search,
    children: [
      {
        path: ':id',
        component: SingerDetail
      }
    ]
  },
  {
    path: '/user',
    components: {
      user: UserCenter
    }
  }
]

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes
})

export default router
