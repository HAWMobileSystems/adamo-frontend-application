var webpackMerge = require('webpack-merge');
// var ExtractTextPlugin = require('extract-text-webpack-plugin');
var commonConfig = require('./webpack.common.js');
var helpers = require('./helpers');
var webpack = require('webpack');

module.exports = webpackMerge(commonConfig, {
  mode: 'development',
  devtool: 'source-map',
  module: {
    rules: [{
        test: /\.less$/,
        use: [{
          loader: "style-loader"
        }, {
          loader: "css-loader"
        }, {
          loader: "less-loader",
          options: {
            strictMath: true,
            noIeCompat: true
          }
        }]
      },

    ]
  },
  output: {
    path: helpers.root('dist'),
    publicPath: 'http://localhost:8080/',
    filename: '[name].js',
    chunkFilename: '[id].chunk.js'
  },

  plugins: [
    // new ExtractTextPlugin('[name].css'),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery'
    })
  ],

  devServer: {
    historyApiFallback: true,
    stats: 'minimal'
  }
});