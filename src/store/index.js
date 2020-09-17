import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

import { articleApi } from '../api'

function createdTimeSort (blog1, blog2) {
  return blog2['createdOn'] - blog1['createdOn']
}

export function createStore () {
  return new Vuex.Store({
    state: {
      list: [],
      articleCache: {}
    },
    getters: {
      articleTags (state) {
        const { list } = state
        const tags = {}
        list.forEach(article => {
          article.tags.forEach(tag => {
            let count = tags[tag]
            tags[tag] = count ? ++count : 1
          })
        })
        return tags
      },
      currentArticle (state) {
        const { route: { params }, articleCache } = state

        let article = null
        if ( params && params.id ) {
          article = articleCache[params.id]
        }
        return article
      }
    },
    mutations: {
      FETCHED_ARTICLES (state, articleList) {
        state.list = articleList.sort(createdTimeSort)
      },
      FETCHED_ARTICLE (state, { article, id }) {
        const cache = {
          [id]: article
        }
        state.articleCache = { ...state.articleCache, ...cache }
      },

      ADD_ARTICLE (state, { article }) {
        state.list = [...state.list, article].sort(createdTimeSort)
      },
      REMOVE_ARTICLE (state, { id }) {
        state.list = state.list.filter(article => article.id !== id)
        if (id in state.articleCache) {
          const copy = { ...state.articleCache }
          delete copy[id]
          state.articleCache = copy
        }
      },
      UPDATE_ARTICLE (state, { article }) {
        const updateId = article.id
        const articleIdx = state.list.findIndex(_ => _.id === updateId)
        if (~articleIdx) {
          state.list.splice(articleIdx, 1, article)
        }
        if (updateId in state.articleCache) {
          const copy = { ...state.articleCache }
          copy[updateId] = article
          state.articleCache = copy
        }
      }
    },
    actions: {
      fetchArticleList ({ commit, state }) {
        // 避免客户端重复请求数据
        if (state.list.length > 0) {
          return Promise.resolve()
        }

        return articleApi.fetchArticles()
          .then(result => {
            const articleList = result
            commit('FETCHED_ARTICLES', articleList) 
          })
      },
      fetchArticle ({ state, commit }, { id }) {
        // 避免客户端重复请求数据
        if (state.articleCache[id]) {
          const article = state.articleCache[id]
          commit('FETCHED_ARTICLE', { article, id })
          return Promise.resolve()
        }

        return articleApi.fetchArticleById({ id })
          .then(result => {
            const article = result
            commit('FETCHED_ARTICLE', { article, id })
          })
      },

      addArticle ({ commit }, { data }) {
        commit('ADD_ARTICLE', { article: data })
      },
      removeArticle ({ commit }, { id }) {
        commit('REMOVE_ARTICLE', { id })
      },
      updateArticle ({ commit }, { data }) {
        commit('UPDATE_ARTICLE', { article: data })
      }
    }
  })
}