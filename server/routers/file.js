module.exports = app => {
  const router = require('express').Router(),
        { checkAuth, fileUpload } = require('../middleware'),
        { getImageContent } = require('../utils/fsTools'),
        { join } = require('path')

  router.post('/upload', checkAuth, fileUpload.single('image'), (req, res, next) => {
    try {
      console.log(req.file)
      if (!req.file) {
        return res.status(400).json({
          code: 400,
          error: {
            message: '请检查文件大小及格式'
          }
        })
      }

      const fileName = req.file.filename
      const imagePath = fileName ? `${process.env.API_URL || 'http://localhost:8848/api'}/file/${fileName}` : ''
      res.status(201).json({
        code: 201,
        data: {
          fileName,
          imagePath
        }
      })
    } catch (error) {
      next(error)
    }
  })

  router.get('/:file', async (req, res, next) => {
    try {
      const { file } = req.params
      const imagePath = join(__dirname, '..', process.env.IMAGE_DIR, file)
      const content = await getImageContent(imagePath)
      res.write(content, 'binary')
      res.end()
    } catch (error) {
      error.status = 404
      next(error)
    }
  })

  app.use('/api/file', router)
}