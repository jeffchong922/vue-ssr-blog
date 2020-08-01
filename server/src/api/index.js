// create-api socket-event 是一个别名，配置在 webpack
import { createAPI } from 'create-api'
import { eventMap } from 'socket-event'

const logRequest = !!process.env.DEBUG_API
const socketURL = process.env.SOCKET_URL
const baseURL = process.env.API_URL

/**
 * @type {import('axios').AxiosInstance}
 */
const api = createAPI({
  baseURL,
  socketURL
})

function fetch (child, params) {
  logRequest && console.log(`fetching ${child}...`)
  const cache = api.cachedItems
  if (cache && cache.has(child)) {
    logRequest && console.log(`cache hit for ${child}.`)
    return Promise.resolve(cache.get(child))
  } else {
    return new Promise((resolve, reject) => {
      api.get(child, {
        params,
      }).then(result => {
        const { data } = result
        logRequest && console.log(`fetched ${child}.`)
        if (data) data.__lastUpdated = Date.now()
        cache && cache.set(child, data)
        resolve(data)
      }).catch(reject)
    })
  }
}

export function fetchArticleList () {
  logRequest && console.log(`fetchArticleList: cachedLength ${ api.cachedArticleList && api.cachedArticleList.length }`)
  return api.cachedArticleList && api.cachedArticleList.length
    ? Promise.resolve(api.cachedArticleList)
    : fetch(`/article`)
}

export function fetchArticleById (id) {
  return fetch(`/article/${id}`)
}

export function fetchArticleTags () {
  return fetch(`/article/all-tag`)
}

export function watchArticles (callback) {
  api.socket && api.socket.on(eventMap.ARTICLES_CHANGE, callback)
  api.socket && api.socket.on(eventMap.ARTICLE_CHANGE, callback)
  return () => {
    api.socket && api.socket.removeListener(eventMap.ARTICLES_CHANGE, callback)
    api.socket && api.socket.removeListener(eventMap.ARTICLE_CHANGE, callback)
  }
}

export function watchArticle (callback) {
  api.socket && api.socket.on(eventMap.ARTICLE_CHANGE, callback)
  return () => {
    api.socket && api.socket.removeListener(eventMap.ARTICLE_CHANGE, callback)
  }
}