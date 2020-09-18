const fs = require('fs')
const path = require('path')
const LRU = require('lru-cache')
const dotenv = require('dotenv')
const express = require('express')
const favicon = require('serve-favicon')
const compression = require('compression')
const { createBundleRenderer } = require('vue-server-renderer')

const resolve = file => path.resolve(__dirname, file)

if (fs.existsSync(resolve('./.env'))) {
  console.log('使用 .env 加载环境变量')
  dotenv.config({
    path: resolve('./.env')
  })
} else {
  console.log('使用 .env.example 加载环境变量')
  dotenv.config({
    path: resolve('./.env.example'),
  })
}

let metaList = []
if (fs.existsSync(resolve('./head-meta-info.js'))) {
  metaList = require('./head-meta-info')
  if (!Array.isArray(metaList)) {
    metaList = []
  }
}

const port = process.env.SERVER_PORT || 9999
const isProd = process.env.NODE_ENV === 'production'
const useMicroCache = process.env.MICRO_CACHE === 'true'

// 服务端信息
const serverInfo =
  `express/${require('express/package.json').version} ` +
  `vue-server-renderer/${require('vue-server-renderer/package.json').version}`

const microCacheMax = 50 // 缓存数量
const microCacheMaxAge = 1000 // 1s 过期
let microCache
if (useMicroCache) {
  microCache = new LRU({
    max: microCacheMax,
    maxAge: microCacheMaxAge // 更新周期
  })
}

// meta 标签
let meta = ''
metaList.forEach(metaInfo => {
  let temp = '<meta '
  Object.keys(metaInfo).forEach(key => {
    temp += `${key}="${metaInfo[key]}" `
  })
  temp += '/>'
  meta += temp
})
console.log('meta: ', meta)

const app = express()

// 创建 renderer
function createRenderer (bundle, options) {
  return createBundleRenderer(bundle, Object.assign(options, {
    // 显式地声明 server bundle 的运行目录
    // 运行时将会以此目录为基准来解析 node_modules 中的依赖模块
    // 只有在所生成的 bundle 文件与外部的 NPM 依赖模块放置在不同位置，
    // 或者 vue-server-renderer 是通过 NPM link 链接到当前项目中时，才需要配置此选项
    // baseDir: resolve('./dist'),
    // 是否运行在新的上下文，设置 false 前提是每次渲染都是创建新的实例
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
}
else {
  readyPromise = require('./build/setup-dev-server')(
    app,
    templatePath,
    (bundle, options) => {
      renderer = createRenderer(bundle, options)
    }
  )
}

const serve = (path, cache) => express.static(resolve(path), {
  maxAge: cache && isProd ? 1000 * 60 * 60 * 24 * 30 : 0
})
app.use(compression())
app.use(favicon(resolve('./public/favicon.ico')))
app.use('/dist', serve('./dist', true))
app.use('/public', serve('./public', true))


/**
 * @param {import('express').Request} req 
 */
function isCacheable (req) {
  // 检查请求是否是用户特定(user-specific)
  // 只有非用户特定 (non-user-specific) 页面才会缓存
  return true
}
// 1-second microCache
app.get('*', (req, res, next) => {
  const cacheable = useMicroCache && isCacheable(req)
  if (cacheable) {
    const hit = microCache.get(req.url)
    if (hit) {
      return res.end(hit)
    }
  }
  next()
})

/**
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
function render (req, res) {
  const startTimeStamp = Date.now()

  res.setHeader("Content-Type", "text/html")
  res.setHeader("Server", serverInfo)

  const handleError = err => {
    if (err.url) {
      res.redirect(err.url)
    } else if(err.code === 404) {
      res.status(404).send('404 | Page Not Found')
    } else {
      // Render Error Page or Redirect
      res.status(500).send('500 | Internal Server Error')
      console.error(`error during render : ${req.url}`)
      console.error(err.stack)
    }
  }

  const context = {
    title: 'Jeff`s Blog', // 默认 title
    url: req.url,
    meta
  }

  renderer.renderToString(context, (err, html) => {
    if (err) {
      return handleError(err)
    }
    res.send(html)

    // 页面级别缓存
    if (useMicroCache) {
      microCache.set(req.url, html)
    }

    if (!isProd) {
      console.log(`整个页面请求花费: ${Date.now() - startTimeStamp}ms`)
    }
  })
}

app.get(
  '*',
  isProd
    ? render
    : (req, res) => {
      readyPromise.then(() => render(req, res))
    }
)

app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`)
})