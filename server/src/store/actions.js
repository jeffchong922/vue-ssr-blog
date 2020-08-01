import {
  fetchArticleList,
  fetchArticleTags,
  fetchArticleById
} from '../api'

export default {
  FETCH_ARTICLE_LIST: ({ commit }) => {
    return fetchArticleList()
      .then(articles => commit('SET_ARTICLE_LIST', { articles }))
  },
  FETCH_ARTICLE_TAGS: ({ commit }) => {
    return fetchArticleTags()
      .then(tags => commit('SET_ARTICLE_TAGS', { tags }))
  },
  FETCH_ARTICLE: ({ commit, state }, { id, force }) => {
    if (!id) return Promise.reject('FETCH_ARTICLE must need id param')
    
    let needFetch = force || false
    const now = Date.now()
    const article = state.articles[id]

    if (!article || (now - article.__lastUpdated > 1000 * 60 * 3)) needFetch = true

    return needFetch
      ? fetchArticleById(id).then(article => commit('SET_ARTICLE', { id, article }))
      : Promise.resolve()
  },
  SET_ACTIVE_TAG: ({ commit }, { tag }) => {
    commit('SET_ACTIVE_TAG', { tag })
  }
}