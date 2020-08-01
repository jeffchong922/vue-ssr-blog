const path = require('path')
const webpack = require('webpack')
const { merge } = require('webpack-merge')
const baseConfig = require('./webpack.base.config')
const NodeExternals = require('webpack-node-externals')
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin')

const isProd = process.env.NODE_ENV === 'production'
const resolve = file => path.resolve(__dirname, file)

module.exports = merge(baseConfig, {
  target: 'node',
  devtool: 'source-map',
  entry: resolve('../src/entry-server.js'),
  output: {
    filename: 'server-bundle.js',
    libraryTarget: 'commonjs2'
  },
  resolve: {
    alias: {
      'create-api': './create-api-server.js'
    }
  },
  externals: NodeExternals({
    allowlist: /\.css$/
  }),
  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/,
        use: isProd
          ? [
              {
                loader: 'css-loader',
                options: {
                  onlyLocals: true,
                  importLoaders: 2 // 在使用 css-loader 之前还有几个 loader
                }
              },
              {
                loader: 'postcss-loader',
                options: {
                  plugins: () => [require('autoprefixer')()]
                }
              },
              'sass-loader'
            ]
          : [ 'vue-style-loader', 'css-loader', 'sass-loader' ]
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      'process.env.VUE_ENV': '"server"'
    }),
    new VueSSRServerPlugin()
  ]
})