module.exports = app => {
  const fs = require('fs'),
        path = require('path'),
        LRU = require('lru-cache'),
        express = require('express'),
        { createBundleRenderer } = require('vue-server-renderer')

  const resolve = file => path.resolve(__dirname, file)

  const isProd = process.env.NODE_ENV === 'production'
  const serverInfo =
  `express/${require('express/package.json').version} ` +
  `vue-server-renderer/${require('vue-server-renderer/package.json').version}`

  function createRenderer (bundle, options) {
    return createBundleRenderer(bundle, Object.assign(options, {
      cache: new LRU({
        max: 1000,
        maxAge: 1000 * 60 * 15
      }),
      runInNewContext: false
    }))
  }

  let renderer
  let readyPromise
  const templatePath = resolve('./src/index.template.html')
  if (isProd) {
    const template = fs.readFileSync(templatePath, 'utf-8')
    const bundle = require('./dist/vue-ssr-server-bundle.json')
    const clientManifest = require('./dist/vue-ssr-client-manifest.json')
    renderer = createRenderer(bundle, {
      template,
      clientManifest
    })
  } else {
    readyPromise = require('./build/setup-dev-server')(
      app,
      templatePath,
      (bundle, options) => {
        renderer = createRenderer(bundle, options)
      }
    )
  }

  function render (req, res) {
    const s = Date.now()

    res.setHeader('Content-Type', 'text/html')
    res.setHeader('Server', serverInfo)

    const handleError = err => {
      if (err.url) {
        res.redirect(err.url)
      } else if (err.code === 404) {
        res.status(404).send('404 | Page Not Found')
      } else {
        res.status(500).send('500 | Internal Server Error')
        console.error(`渲染错误， URL : ${req.url}`)
        console.error(err.stack)
      }
    }

    const context = {
      title: 'Jeff Chong 的简易博客',
      url: req.url
    }

    renderer.renderToString(context, (err, html) => {
      if (err) {
        return handleError(err)
      }
      res.send(html)

      if (!isProd) {
        console.log(`整个页面请求花费: ${Date.now() - s}ms`)
      }
    })
  }

  const serve = (path, cache) => express.static(resolve(path), {
    maxAge: cache && isProd ? 1000 * 60 * 60 * 24 * 30 : 0
  })
  app.use('/dist', serve('./dist', true))
  app.use('/public', serve('./public', true))

  app.get('*', isProd ? render : (req, res) => {
    readyPromise.then(() => render(req, res)).catch(err => console.log(`readyPromise err: `, err))
  })
}