import router from '../router'
import { signInByToken } from '../models/AuthModel'
import { getToken, getLocalToken, setToken, clearToken } from './token'

router.beforeEach(async (to, from, next) => {
  const token = getToken()
  const localToken = getLocalToken()

  if (token) {
    if (to.path === '/auth') {
      next('/')
    } else {
      next()
    }
  } else if (localToken) {
    try {
      const result = await signInByToken(localToken)
      const { data } = result
      if (data.data && data.data.accessToken) {
        setToken(data.data.accessToken)
        if (to.path === '/auth') {
          next('/')
        } else {
          next()
        }
      } else {
        throw new Error()
      }
    } catch (error) {
      clearToken()
      next('/auth')
    }
  } else {
    if (to.path === '/auth') {
      next()
    } else {
      next('/auth')
    }
  }
})