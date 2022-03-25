/* eslint-disable @typescript-eslint/no-require-imports */
const path = require('path')

const webpack = require('webpack')
const { merge } = require('webpack-merge')
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')

const common = require('./webpack.common')
console.log(path.resolve(process.cwd(), 'template/index.html'))
module.exports = merge(common, {
  devServer: {
    static: {
      directory: path.resolve(__dirname, 'build'),
    },
    port: process.env.START_SUB === 'alone' ? 8000 : 4001,
    open: process.env.START_SUB === 'alone',
    hot: true,
    compress: true,
    historyApiFallback: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    }
  },
  plugins: [new webpack.HotModuleReplacementPlugin(), new ReactRefreshWebpackPlugin()],
})
