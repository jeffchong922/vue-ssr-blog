export default {
  activeArticleList: (state) => {
    const { activeTag, articleList } = state
    return !activeTag
      ? articleList
      : articleList.filter(article => article.tags.includes(activeTag))
  },
}