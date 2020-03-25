var webpackMerge = require('webpack-merge');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var commonConfig = require('./webpack.common.js');
var helpers = require('./helpers');
var webpack = require('webpack');

module.exports = webpackMerge(commonConfig, {
    devtool: 'source-map',
 module: {
    loaders: [
      {
        test: /\.scss$/,
        loaders: ["style-loader", "css-loader", "sass-loader"]
      }, 
      {
        test: /\.less$/,
        exclude: /node_modules/,
        loader: 'raw-loader!less-loader'
}
    ]
  },
    output: {
        path: helpers.root('dist'),
        publicPath: 'http://localhost:8081/',
        filename: '[name].js',
        chunkFilename: '[id].chunk.js'
    },

    plugins: [
        new ExtractTextPlugin('[name].css'),
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
