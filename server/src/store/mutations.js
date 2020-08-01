import Vue from 'vue'

export default {
  SET_ARTICLE_LIST: (state, { articles }) => {
    state.articleList = [].concat(articles)
  },
  SET_ARTICLE_TAGS: (state, { tags }) => {
    state.articleTags = [].concat(tags)
  },
  SET_ACTIVE_TAG: (state, { tag }) => {
    state.activeTag = tag
  },
  SET_ARTICLE: (state, { id, article }) => {
    Vue.set(state.articles, id, article)
  }
}