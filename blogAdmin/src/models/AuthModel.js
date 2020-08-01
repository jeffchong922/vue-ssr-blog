import request from '../utils/request'

export function signIn (data) {
  return request({
    method: 'POST',
    url: '/auth/sign-in',
    data
  })
}

export function signInByToken (token) {
  return request({
    method: 'POST',
    url: '/auth/sign-in-token',
    headers: {
      Authorization: 'Bearer ' + (token || '')
    }
  })
}