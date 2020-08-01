const path = require('path')
const resolve = file => path.resolve(__dirname, file)

module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],
  publicPath: process.env.NODE_ENV === 'production'
    ? '/admin/'
    : '/',
  outputDir: resolve('../server/public/admin')
}