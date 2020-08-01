import axios from 'axios'
import LRU from 'lru-cache'
import io from 'socket.io-client'
import { eventMap } from 'socket-event'

async function getArticleList (request) {
  let data = []
  try {
    const result = await request.get('/article')
    if (result.data) data = result.data
  } catch (error) {
    console.log(`fetch articles error: `, error)
  }
  return data
}

async function getArticleById (request, id, params) {
  let data = undefined
  try {
    const result = await request.get(`/article/${id}`, {
      params
    })
    if (result.data) data = result.data
  } catch (error) {
    console.log(`fetch article error: `, error)
  }
  return data
}

export function createAPI ({ baseURL, socketURL }) {
  let api
  if (process.__API__) {
    api = process.__API__
  } else {
    api = process.__API__ = axios.create({
      baseURL,
      timeout: 1000 * 10 * 15,
      timeoutErrorMessage: '请求数据超时'
    })

    api.socket = io(socketURL)
    api.onServer = true

    api.interceptors.request.use(
      config => {
        config.params = Object.assign({}, config.params, { timestamp: Date.now() })
        return config
      },
      error => {
        return Promise.reject(error)
      }
    )

    api.interceptors.response.use(
      res => {
        return res.data || {}
      },
      err => {
        return Promise.reject(err.response)
      }
    )
    
    api.cachedItems = new LRU({
      max: 50,
      maxAge: 1000 * 60 * 1
    })

    api.cachedArticleList
    getArticleList(api)
      .then(data => {
        api.cachedArticleList = data
      })
      .catch(err => console.log(`1 fetch articles error: `, err))

    api.socket && api.socket.on(eventMap.ARTICLES_CHANGE, () => {
      api.cachedArticleList = []
      getArticleList(api)
        .then(data => {
          api.cachedArticleList = data
        })
        .catch(err => console.log(`2 fetch articles error: `, err))
    })

    api.socket && api.socket.on(eventMap.ARTICLE_CHANGE, ({ id }) => {
      if (api.cachedItems.has(`/article/${id}`)) {
        api.cachedItems.del(`/article/${id}`)
      }
      getArticleById(api, id, { content: '1'})
        .then(data => {
          const changedIndex = api.cachedArticleList.findIndex((article) => article._id === id)
          if (~changedIndex && data) {
            api.cachedArticleList.splice(changedIndex, 1, data)
          }
        })
        .catch(err => console.log(`fetch article error: `, err))
    })
  }
  return api
}