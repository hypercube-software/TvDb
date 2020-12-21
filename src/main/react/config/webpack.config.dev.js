const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { merge } = require('webpack-merge')
const { webpackConfig, PROJECT_FOLDER } = require('./webpack.config.common.js')

module.exports = merge(webpackConfig, {
  mode: 'development',
  devtool: false,
  devServer: {
    publicPath: '/',
    contentBase: path.join(PROJECT_FOLDER, 'public'),
    compress: true,
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8080'
      }
    }
  },

  plugins: [
    new webpack.SourceMapDevToolPlugin({
      filename: '[name].[contenthash].js.map',
      sourceRoot: PROJECT_FOLDER
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.resolve(PROJECT_FOLDER, 'templates', 'index.html')
    }),
    new webpack.ProgressPlugin()
  ]
})
