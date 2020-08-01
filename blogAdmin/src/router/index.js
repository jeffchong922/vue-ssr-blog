import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  { path: '/auth', component: () => import('../views/Auth.vue') },
  { path: '/', component: () => import('../views/Home.vue'), redirect: '/article/list',
    children: [
      { path: 'article/edit', component: () => import('../views/Article/edit.vue') },
      { path: 'article/edit/:id', props: true, component: () => import('../views/Article/edit.vue') },
      { path: 'article/list', component: () => import('../views/Article/list.vue') }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
