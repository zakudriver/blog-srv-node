const path = require('path')
const fs = require('fs')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')

let nodeModules = {}
fs.readdirSync('node_modules')
  .filter(function(x) {
    return ['.bin'].indexOf(x) === -1
  })
  .forEach(function(mod) {
    nodeModules[mod] = 'commonjs ' + mod
  })

module.exports = {
  entry: './src/app.ts',
  target: 'node',
  output: {
    filename: 'index.js',
    path: path.join(__dirname, './../dist')
  },
  devtool: 'source-map',
  plugins: [],
  resolve: {
    alias: {
      '@src': path.join(__dirname, './../src')
    },
    extensions: ['.ts', '.tsx', '.js'],
    plugins: [
      new TsconfigPathsPlugin({
        configFile: path.join(__dirname, './../tsconfig.webpack.json'),
        extensions: ['.ts', '.tsx', '.js']
      })
    ]
  },
  module: {
    rules: [{ test: /\.tsx?$/, loader: 'ts-loader' }]
  },
  externals: nodeModules
}
