const express = require('express'),
      favicon = require('serve-favicon'),
      dotenv = require('dotenv'),
      cors = require('cors'),
      app = express()

const server = require('http').createServer(app)
dotenv.config()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(favicon('./public/favicon-32x32.png'))

app.use('/admin', express.static(__dirname + '/public/admin'))

require('./plugins/socket')(server)

require('./routers/auth')(app)
require('./routers/file')(app)
require('./routers/article')(app)

require('./vue-ssr')(app)

require('./error-handler')(app)

require('./plugins/database')(server)