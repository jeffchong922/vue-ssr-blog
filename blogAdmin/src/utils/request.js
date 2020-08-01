import axios from 'axios'
import { getToken } from './token'

const request = axios.create({
  baseURL: process.env.VUE_APP_REQUEST_BASE
})

request.interceptors.request.use(config => {
  const token = getToken()
  if (token && !config.headers.Authorization) {
    config.headers.Authorization = 'Bearer ' + (token || '')
  }
  return config
}, err => {
  return Promise.reject(err)
})

request.interceptors.response.use(res => {
  console.log('axios response success: ', res)
  return res
}, err => {
  console.log('axios response err.response: ', err.response)
  const errData = {}
  if (err.response && err.response.data) {
    errData.message = err.response.data.message || err.response.data.error || '请求发生错误'
    errData.statusCode = err.response.data.statusCode
  } else {
    errData.message = '请求发生错误'
    errData.statusCode = 400
  }
  return Promise.reject(errData)
})

export default request
