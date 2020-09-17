import axios from 'axios'

const isDev = process.env.NODE_ENV !== 'production'

const clientStorage = new Map()

export default function makeRequestClient ({ baseUrl }) {
  let requestClient
  if (clientStorage.has(baseUrl)) {
    requestClient = clientStorage.get(baseUrl)
  } else {
    requestClient = axios.create({
      baseURL: baseUrl
    })
    isDev && console.log(`创建新的请求客户端，baseUrl = ${baseUrl}`)
    clientStorage.set(baseUrl, requestClient)
  }

  return requestClient
}