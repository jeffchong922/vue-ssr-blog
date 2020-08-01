import reducer from '../reducers/article'
import { SET_TITLE, SET_DESC, SET_CREATED_TIME, SET_UPDATED_TIME, SET_CONTENT } from '../actions/article'

export default (vm) => {
  const {
    setTitle,
    setDesc,
    setCreatedTime,
    setUpdatedTime,
    setContent
  } = reducer(vm.$data)

  return function (type, ...args) {
    switch (type) {
      case SET_TITLE:
        vm.articleTitle = setTitle(...args)
        break
      case SET_DESC:
        vm.articleDesc = setDesc(...args)
        break
      case SET_CONTENT:
        vm.articleContent = setContent(...args)
        break
      case SET_CREATED_TIME:
        vm.created_time = setCreatedTime(...args)
        break
      case SET_UPDATED_TIME:
        vm.updated_time = setUpdatedTime(...args)
        break
      default: break
    }
  }
}