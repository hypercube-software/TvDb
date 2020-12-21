const path = require('path')
const { merge } = require('webpack-merge')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const { webpackConfig, buildDirectory, PROJECT_FOLDER } = require('./webpack.config.common.js')

module.exports = merge(webpackConfig, {
  mode: 'production',

  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      filename: '../index.html',
      template: path.resolve(PROJECT_FOLDER, 'templates', 'index.html')
    }),
    new CopyPlugin({
      patterns: [
        { from: 'public', to: buildDirectory }
      ]
    })
  ],

  optimization: {
    minimizer: [new TerserPlugin()],

    splitChunks: {
      cacheGroups: {
        vendors: {
          priority: -10,
          test: /[\\/]node_modules[\\/]/
        }
      },

      chunks: 'async',
      minChunks: 1,
      minSize: 30000,
      name: false
    }
  }
})
