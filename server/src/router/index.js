import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)


export function createRouter () {
  return new Router({
    mode: 'history',
    fallback: false,
    routes: [
      { path: '/', component: () => import('../views/ArticleList.vue') },
      { path: '/article/:id', component: () => import('../views/Article.vue') }
    ]
  })
}