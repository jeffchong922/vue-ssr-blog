// 客户端
import Vue from 'vue'
import { createApp } from './app'
import GithubBar from './components/GithubBar.vue'
import ProgressBar from './components/ProgressBar.vue'

// 全局 progress bar
const progressBar = Vue.prototype.$progressBar = new Vue(ProgressBar).$mount()

const githubBar = new Vue(GithubBar).$mount()

document.body.appendChild(progressBar.$el)
document.body.appendChild(githubBar.$el)

// 客户端数据预取
// 1. 在路由导航之前解析数据
// 2. 匹配要渲染的视图后，再获取数据

// 2. 匹配要渲染的视图后，再获取数据
// Vue.mixin({
//   beforeMount () {
//     const { asyncData } = this.$options
//     if (asyncData) {
//       // 将获取数据操作分配给 promise
//       // 以便在组件中，可以在数据准备就绪后
//       // 通过运行 `this.dataPromise.then(..)` 来执行其他任务
//       this.dataPromise = asyncData({
//         store: this.$store,
//         route: this.$route
//       })
//     }
//   }
// })

// 无论选择哪种策略，当路由组件重用时，也应该调用 asyncData 函数
Vue.mixin({
  beforeRouteUpdate (to, from, next) {
    const { asyncData } = this.$options
    if (asyncData) {
      asyncData({
        store: this.$store,
        route: to
      }).then(next).catch(() => { next({ name: 'not-found' }) })
    } else {
      next()
    }
  }
})

const { app, router, store } = createApp()

// 同步服务器端请求到的数据
if (window.__INITIAL_STATE__) {
  store.replaceState(window.__INITIAL_STATE__)
}


// 在 Vue 2.5+ 的版本中，异步组件现在可以在应用中的任何地方使用，
// 在挂载 app 之前调用 router.onReady，
// 因为路由器必须要提前解析路由配置中的异步组件，
// 才能正确地调用组件中可能存在的路由钩子
router.onReady(() => {

  // 添加路由钩子函数，用于处理 asyncData
  // 在初始化路由 resolve 后执行
  // 以便不会二次预取已有数据
  // 使用 `router.beforeResolve(..)` 以便确保所有异步组件都 resolve
  router.beforeResolve((to, from, next) => {
    // 1. 在路由导航之前解析数据


    // TODO
    const matched = router.getMatchedComponents(to)
    const prevMatched = router.getMatchedComponents(from)

    // 只关心非预渲染的组件
    // 所有对比它们，找出两个匹配列表的差异组件
    let diffed = false
    const activated = matched.filter((c, i) => {
      return diffed || (diffed = (prevMatched[i] !== c))
    })
    // 只获取 asyncData 函数
    const asyncDataHooks = activated.map(c => c.asyncData).filter(_ => _)

    if (!asyncDataHooks.length) {
      return next()
    }

    // 加载指示器
    progressBar.start()
    Promise.all(asyncDataHooks.map(hook => hook({
      store,
      route: to
    }))).then(() => {
      // 停止加载指示器
      progressBar.finish()

      next()
    }).catch(() => {
      progressBar.fail()
      progressBar.finish()
      next({ name: 'not-found' })
    })
  })

  // 注意模板中根元素具有 `id="app"`
  app.$mount('#app')
})

