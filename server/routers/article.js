module.exports = app => {
  const router = require('express').Router(),
        { checkAuth } = require('../middleware'),
        articleModel = require('../models/Article')

  const socketController = require('../plugins/socket')()
  const { eventMap } = require('../plugins/socket/event')

  router.post('/', checkAuth, async (req, res, next) => {
    try {
      console.log('create article user: ', req.body['username'])
      const { title, description, tags, content, created_time, updated_time } = req.body
      const createdArticle = new articleModel({
        title,
        description,
        tags,
        content,
        created_time,
        updated_time
      })
      await createdArticle.save()
      // -----
      socketController.dispatch(eventMap.ARTICLES_CHANGE)
      // -----
      res.status(201).json({
        code: 201,
        data: {
          title: createdArticle.title,
          created_time: createdArticle.created_time,
          updated_time: createdArticle.updated_time,
          id: createdArticle.id,
        }
      })
    } catch (error) {
      next(error)
    }
  })

  router.get('/', async (req, res, next) => {
    try {
      const { tag } = req.query
      let articles = await articleModel.find({}, { content: 0 }).sort({ created_time: -1 })
      if (tag) {
        articles = articles.filter(article => {
          return article.tags.includes(tag)
        })
      }
      res.status(200).json({
        code: 200,
        data: articles
      })
    } catch (error) {
      next(error)
    }
  })

  router.get('/all-tag', async (req, res, next) => {
    try {
      const arrTags = await articleModel.find({}, { tags: 1 })

      const allTag = new Set()
      arrTags.forEach(objTags => {
        objTags.tags.length && objTags.tags.forEach(tag => allTag.add(tag))
      })
      res.status(200).json({
        code: 200,
        data: [...allTag]
      })
    } catch (error) {
      next(error)
    }
  })

  router.get('/:id', async (req, res, next) => {
    try {
      const { id } = req.params
      const { content } = req.query

      let filter = {}
      if (content) filter['content'] = 0

      const article = await articleModel.findById(id, filter)
      article
        ? (
            res.status(200).json({
              code: 200,
              data: article
            })
          )
        : (
            res.status(404).json({
              code: 404,
              error: {
                message: '404 | 所提供的id未找到资源'
              }
            })
          )
    } catch (error) {
      next(error)
    }
  })

  router.patch('/:id', checkAuth, async (req, res, next) => {
    try {
      const { id } = req.params
      const { title, description, tags, content, created_time, updated_time } = req.body

      await articleModel.findByIdAndUpdate(id, {
        title,
        description,
        tags,
        content,
        created_time,
        updated_time
      })

      socketController.dispatch(eventMap.ARTICLE_CHANGE, { id })

      res.status(200).json({
        code: 200,
        data: {}
      })
    } catch (error) {
      next(error)
    }
  })

  router.delete('/:id', checkAuth, async (req, res, next) => {
    try {
      const { id } = req.params
      await articleModel.findByIdAndDelete(id)
      // -----
      socketController.dispatch(eventMap.ARTICLES_CHANGE, 'xxx')
      // -----
      res.status(200).json({
        code: 200,
        data: {}
      })
    } catch (error) {
      next(error)
    }
  })

  app.use('/api/article', router)
}