export default function makeArticleApi ({ makeRequestClient, articleSocket }) {
  // TODO
  const baseUrl = process.env.VUE_APP_ARTICLE_API_URL ||  'http://localhost:8848'
  const isDev = process.env.NODE_ENV !== 'production'

  const apiPath = {
    getArticleList: () => `/blogs`,
    getArticleById: (id) => `/blogs/${id}`
  }
  
  const client = makeRequestClient({ baseUrl })

  if (client.onServer) {
    articleSocket.openConnected()
    articleSocket.listenPost({
      callback: (article) => {
        reCacheList()
      }
    })
    articleSocket.listenUpdate({
      callback: (article) => {
        const { id } = article
        const cache = client.cachedStorage
        const path = apiPath.getArticleById(id)
        if (cache.has(path)) {
          isDev && console.log(`清除 ${path} 缓存`)
          cache.del(path)
          // 重新缓存
          fetchArticleById({ id })
        }

        reCacheList()
      }
    })
    articleSocket.listenDelete({
      callback: (id) => {
        const cache = client.cachedStorage
        const path = apiPath.getArticleById(id)
        if (cache.has(path)) {
          isDev && console.log(`清除 ${path} 缓存`)
          cache.del(path)
        }

        reCacheList()
      }
    })
  }

  function reCacheList () {
    const cache = client.cachedStorage
    const path = apiPath.getArticleList()
    if (cache.has(path)) {
      isDev && console.log(`清除 ${path} 缓存`)
      cache.del(path)
      // 重新缓存
      fetchArticles()
    }
  }

  return Object.freeze({
    fetchArticles,
    fetchArticleById
  })

  function fetch (path) {
    // server 端的缓存池，power by lru-cache
    // const cache = undefined
    const cache = client.cachedStorage
    if (cache && cache.has(path)) {
      isDev && console.log(`请求路径 -> ${path} 命中缓存`)
      return Promise.resolve(cache.get(path))
    } else {
      return client.get(path).then(response => {
        const { data } = response
        cache && cache.set(path, data)
        return data
      })
    }
  }

  function fetchArticles () {
    return fetch(apiPath.getArticleList())
  }

  function fetchArticleById ({ id }) {
    return fetch(apiPath.getArticleById(id))
  }
}