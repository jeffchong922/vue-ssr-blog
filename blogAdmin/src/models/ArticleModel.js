import request from '../utils/request'

export function getArticleTags () {
  return request({
    method: 'GET',
    url: '/article/all-tag',
    params: {
      timestamp: Date.now()
    }
  })
}

export function createArticle (data) {
  return request({
    method: 'POST',
    url: '/article',
    data
  })
}

export function getArticles () {
  return request({
    method: 'GET',
    url: '/article',
    params: {
      timestamp: Date.now()
    }
  })
}

export function updateArticleById (id, data) {
  return request({
    method: 'PATCH',
    url: '/article/' + id,
    data
  })
}

export function getArticleById (id) {
  return request({
    method: 'GET',
    url: '/article/' + id,
    params: {
      timestamp: Date.now()
    }
  })
}

export function deleteArticleById (id) {
  return request({
    method: 'DELETE',
    url: '/article/' + id
  })
}