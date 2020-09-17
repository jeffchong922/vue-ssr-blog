const fs = require('fs')
const path = require('path')
const dotenv = require('dotenv')
const webpack = require('webpack');
const baseConfig = require('./webpack.base.config')
const { default: merge } = require("webpack-merge")
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin');

const isProd = process.env.NODE_ENV === 'production'
const resolve = file => path.resolve(__dirname, file)

// 默认配置
const definitions = {
  'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
  'process.env.VUE_ENV': '"client"'
}
let parsed = {}
if (fs.existsSync(resolve('../.env'))) {
  console.log('使用 .env 加载环境变量')
  ;({ parsed } = dotenv.config({
    path: resolve('../.env')
  }))
} else {
  console.log('使用 .env.example 加载环境变量')
  ;({ parsed } = dotenv.config({
    path: resolve('../.env.example')
  }))
}
Object.keys(parsed).forEach(key => {
  if (/^VUE_APP_\w+/.test(key))
  definitions[`process.env.${key}`] = JSON.stringify(parsed[key])
})
console.log(definitions)

module.exports = merge(baseConfig, {
  entry: {
    app: resolve('../src/entry-client.js')
  },
  resolve: {
    alias: {
      'request-client': './request-client-c.js'
    }
  },
  optimization: {
    moduleIds: 'hashed',
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        }
      }
    },
    // 将 webpack 运行时分离到一个引导 chunk 中，
    // 以便可以在之后正确注入异步 chunk
    // 也为的 应用程序/vendor 代码提供了更好的缓存。
    runtimeChunk: {
      name: 'manifest'
    }
  },
  module: {
    rules: [
      {
        test: /\.(c|sc)ss$/,
        use: [
          isProd
            ? MiniCssExtractPlugin.loader
            : 'vue-style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: [
                require('tailwindcss'),
                require('autoprefixer')
              ]
            }
          },
          'sass-loader'
        ]
      },
    ]
  },
  plugins: [
    ...prodPlugins(isProd),
    // 配置环境变量
    new webpack.DefinePlugin(definitions),
    // 此插件在输出目录中
    // 生成 `vue-ssr-client-manifest.json`
    new VueSSRClientPlugin()
  ]
})

function prodPlugins (isProd) {
  const plugins = []
  if (isProd) {
    plugins.push(
      new MiniCssExtractPlugin({
        filename: 'common.[chunkhash].css'
      })
    )
  }
  return plugins
}