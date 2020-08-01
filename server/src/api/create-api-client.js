import axios from 'axios'
import io from 'socket.io-client'

export function createAPI ({ baseURL, socketURL }) {
  let api = axios.create({
    baseURL,
    timeout: 1000 * 10,
    timeoutErrorMessage: '请求数据超时'
  })
  api.socket = io(socketURL)

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
      console.log(`request to ${res.config.url} success: `, res)
      return res.data
    },
    err => {
      console.log(`request to ${res.config.url} error: `, err.response)
      return Promise.reject(err.response)
    }
  )
  return api
}