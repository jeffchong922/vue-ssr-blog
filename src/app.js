import Vue from 'vue'
import { createStore } from './store'
import { createRouter } from './router'
import { sync } from 'vuex-router-sync'
import { titleMixin } from './mixins'

import App from './App.vue'

// 处理 title 的 mixin
Vue.mixin(titleMixin)

// 导出工厂函数，创建新的实例
export function createApp () {
  // 创建 store 和 router 实例
  const store = createStore()
  const router = createRouter()

  // 同步路由状态(route state)到 store
  sync(store, router)

  // 创建应用程序实例，注入 router 和 store
  const app = new Vue({
    store,
    router,
    render: h => h(App)
  })

  // 暴露 app, router 和 store
  return { app, store, router }
}