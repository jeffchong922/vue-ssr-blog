import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

const NotFound = () => import('../views/NotFound.vue')
const ArticleList = () => import('../views/ArticleList.vue')
const ArticleDetail = () => import('../views/ArticleDetail.vue')

// 服务器代码使用了一个 * 处理程序，它接受任意 URL
// history 模式是非常好的方式
export function createRouter () {
  return new Router({
    mode: 'history',
    scrollBehavior: () => ({ y: 0 }),
    // 当浏览器不支持 history.pushState 控制路由是否应该回退到 hash 模式
    fallback: false,
    routes: [
      { path: '/', redirect: '/articles' },
      { path: '/articles', component: ArticleList },
      { path: '/articles/:id', component: ArticleDetail },
      { path: '/404', name: 'not-found', component: NotFound },
      { path: '*', redirect: '/404'}
    ]
  })
}