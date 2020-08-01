// import jsCookie from 'js-cookie'
import { setItem, getItem, removeItem } from './storage'

export function setToken (token) {
  setItem('token', token, 'session')
  setItem('token', token)
  // sessionStorage.setItem('token', token)
  // jsCookie.set('token', token, {
  //   expires: 7
  // })
}

export function getToken () {
  return getItem('token', 'session')
  // return sessionStorage.getItem('token')
  // return jsCookie.get('token')
}

export function getLocalToken () {
  return getItem('token')
  // return sessionStorage.getItem('token')
  // return jsCookie.get('token')
}

export function clearToken () {
  removeItem('token', 'session')
  removeItem('token')
  // sessionStorage.removeItem('token')
  // jsCookie.remove('token')
}

