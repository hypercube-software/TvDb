const path = require('path')
const webpack = require('webpack')
const PROJECT_FOLDER = path.resolve(__dirname, '..')
const buildDirectory = path.resolve(PROJECT_FOLDER, 'build')

console.log('PROJECT_FOLDER: ' + PROJECT_FOLDER)

const webpackConfig = {
  entry: './src/index.jsx',
  context: PROJECT_FOLDER,
  output: {
    filename: '[name].[contenthash].js',
    path: path.resolve(buildDirectory, 'static')
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: [/node_modules/]
      },
      {
        test: /.jsx?$/,
        exclude: [/node_modules/],
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
            plugins: ['@babel/plugin-proposal-class-properties']
          }
        }
      },
      {
        test: /\.(ico|jpe?g|png|gif|webp|svg|mp4|webm|wav|mp3|m4a|aac|oga|ttf|woff|woff2|eot)(\?.*)?$/,
        loader: 'file-loader'
      },
      {
        test: /.(less|css)$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              modules: {
                localIdentName: '[path][name]__[local]--[hash:base64:5]'
              },
              url: (url, resourcePath) => {
                // Don't put this image in the bundle
                if (url.includes('background.jpg')) {
                  return false
                }
                return true
              }
            }
          },
          {
            loader: 'less-loader',
            options: {
              sourceMap: true
            }
          }]
      }]
  },

  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx']
  },

}

module.exports = {
  webpackConfig: webpackConfig,
  buildDirectory: buildDirectory,
  PROJECT_FOLDER: PROJECT_FOLDER
}
