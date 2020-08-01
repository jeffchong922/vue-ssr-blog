module.exports = (app) => {

  app.use((req, res, next) => {
    const err = new Error('404 | Not Found')
    err.status = 404
    next(err)
  })

  app.use((err, req, res, next) => {
    if (err.message === 'File too large') {
      err.status = 413 /* payload too large */
    }
    if (err.message === 'jwt expired') {
      err.status = 417 /* expectation failed */
    }
  
    res.status(err.status || 500)
    res.json({
      code: err.status || 500,
      error: {
        message: `${err.status} | ${err.message}`
      }
    })
  })
}