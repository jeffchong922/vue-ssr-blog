import axios from 'axios'
import LRU from 'lru-cache'

const isDev = process.env.NODE_ENV !== 'production'

let clientStorage
if (process.__CLIENT_STORAGE__) {
  clientStorage = process.__CLIENT_STORAGE__
} else {
  clientStorage = new Map()
}

const LRU_MAX = 100
const LRU_MAX_AGE = 1000 * 60 * 60 * 24 // 1 day cache

export default function makeRequestClient ({ baseUrl }) {
  let requestClient
  if (clientStorage.has(baseUrl)) {
    requestClient = clientStorage.get(baseUrl)
  } else {
    requestClient = axios.create({
      baseURL: baseUrl
    })
    isDev && console.log(`创建新的请求客户端，baseUrl = ${baseUrl}`)

    requestClient.cachedStorage = new LRU({
      max: LRU_MAX,
      maxAge: LRU_MAX_AGE
    })

    requestClient.onServer = true

    clientStorage.set(baseUrl, requestClient)
  }

  return requestClient
}