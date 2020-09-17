// 服务端
import { createApp } from './app'

const isDev = process.env.NODE_ENV !== 'production'

export default context => {

  // 因为有可能是异步路由钩子函数或组件，
  // 所以返回一个 Promise，
  // 以便服务器能够等待所有的内容在渲染前就已经准备就绪
  return new Promise((resolve, reject) => {
    const startTimeStamp = isDev && Date.now()

    const { app, router, store } = createApp()

    const { url } = context

    // TODO
    const { fullPath } = router.resolve(url).route
    if (fullPath !== url) {
      return reject({ url: fullPath })
    }

    // 同步请求 url 到 router 的位置
    router.push(url)

    // 等到 router 将可能的异步组件和钩子函数解析完
    router.onReady(() => {
      // TODO
      const matchedComponents =  router.getMatchedComponents()

      // 匹配不到路由，执行 reject 函数，并返回 404
      if (!matchedComponents.length) {
        return reject({ code: 404 })
      }

      // 服务器端数据预取
      // 对所有匹配的路由组件调用 `asyncData(..)`
      Promise.all(matchedComponents.map(({ asyncData }) => asyncData &&
        asyncData({
          store,
          route: router.currentRoute
        }))).then(() => {

          // 在所有预取钩子 resolve 后，
          // store 已经填充入渲染应用程序所需的状态
          // 将状态附加到上下文，
          // 当 `template` 选项用于 renderer 时，
          // 状态将自动序列化为 `window.__INITIAL_STATE__`，并注入 HTML
          context.state = store.state

          isDev && console.log(`数据预取花费: ${Date.now() - startTimeStamp}ms`)

          // Promise 应该 resolve 应用程序实例，以便渲染
          resolve(app)
        }).catch(() => {
          reject({ code: 404 })
        })
    }, reject)
  })
}
