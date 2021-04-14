import { createStore, createLogger } from 'vuex'
import state from './state'
import mutations from './mutations'
import * as getters from './getters'
import * as actions from './actions'

const debug = process.env.NODE_ENV !== 'production'

// 创建vuex实例
export default createStore({
  state,
  getters,
  mutations,
  actions,
  // 开发环境开启严格模式规范state的修改
  strict: debug,
  // 开发环境使用log插件
  plugins: debug ? [createLogger()] : []
})
