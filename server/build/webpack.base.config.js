const path = require('path')
const webpack = require('webpack')
const TerserPlugin = require('terser-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader')

const isProd = process.env.NODE_ENV === 'production'
const resolve = file => path.resolve(__dirname, file)

module.exports = {
  mode: isProd
    ? 'production'
    : 'development',
  devtool: isProd
    ? false
    : 'cheap-module-source-map',
  output: {
    path: resolve('../dist'),
    publicPath: '/dist/',
    filename: '[name].[chunkhash].js'
  },
  optimization: {
    minimize: isProd,
    minimizer: [new TerserPlugin()]
  },
  resolve: {
    alias: {
      '@': resolve('../src'),
      'public': resolve('../public'),
      'socket-event$': resolve('../plugins/socket/event.js')
    }
  },
  module: {
    noParse: /es6-promise\.js$/,
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          extractCSS: isProd,
          compilerOptions: {
            preserveWhitespace: false
          }
        }
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: ["@babel/plugin-transform-runtime"]
          }
        }
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: '[name].[ext]?[hash]',
          esModule: false
        }
      }
    ]
  },
  plugins: isProd
    ? [
      new VueLoaderPlugin(),
      new webpack.optimize.ModuleConcatenationPlugin(),
    ]
  : [
      new VueLoaderPlugin(),
      new FriendlyErrorsPlugin()
    ]
}