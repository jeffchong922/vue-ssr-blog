const path = require('path')
const webpack = require('webpack')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')

const isProd = process.env.NODE_ENV === 'production'
const resolve = file => path.resolve(__dirname, file)

/**
 * @type {import('webpack').Configuration}
 */
module.exports = {
  mode: isProd
    ? 'production'
    : 'development',
  devtool: isProd
    ? false
    : 'cheap-module-source-map',
  output: {
    publicPath: '/dist/',
    path: resolve('../dist'),
    filename: '[name].[chunkhash].js',
  },
  optimization: {
    minimizer: [new TerserPlugin(), new OptimizeCssAssetsPlugin()]
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          compilerOptions: {
            preserveWhitespace: false
          }
        }
      },
      {
        test: /\.js$/,
        exclude: file => (/node_modules/.test(file) && !/\.vue\.js/.test(file)),
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: ['@babel/plugin-transform-runtime']
          }
        }
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: '[name].[ext]?[hash]',
          esModule: false // TODO
        }
      },
    ]
  },
  plugins: isProd
    ? [
        new VueLoaderPlugin(),
        new webpack.optimize.ModuleConcatenationPlugin()
      ]
    : [
        new VueLoaderPlugin()
      ]
}