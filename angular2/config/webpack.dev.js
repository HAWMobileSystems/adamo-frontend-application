var webpackMerge = require('webpack-merge');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var commonConfig = require('./webpack.common.js');
var helpers = require('./helpers');
var webpack = require('webpack');

module.exports = webpackMerge(commonConfig, {
    devtool: 'source-map',
    module: {
        rules: [{
                test: /\.scss$/,
                use: [{
                    loader: 'style-loader'
                }, {
                    loader: 'css-loader'
                }, {
                    loader: 'sass-loader'
                }]
            },
            {
                test: /\.less$/,
                exclude: /node_modules/,
                include: [helpers.root('src')],
                // use: ['style-loader', 'less-loader']


                use: ['to-string-loader', 'style-loader', 'css-loader', 'less-loader']
                // use: ['style-loader', 'css-to-string-loader', 'css-loader', 'less-loader']
                // use: ['less-loader']

                //use: ['style-loader', 'raw-loader', 'less-loader']

                //     {
                //     loader: 'raw-loader'
                // }, {
                //     loader: 'less-loader'
                // }]
            },
            {
                test: /\.css$/,
                exclude: /node_modules/,
                include: [helpers.root('src')],
                // use: ['style-loader', 'less-loader']
                use: [
                    ExtractTextPlugin.extract({
                        fallback: 'style-loader',
                        use: 'css-loader'
                    }),
                    {
                        loader: 'to-string-loader'
                    }, {
                        loader: 'css-loader'
                    }, {
                        loader: 'less-loader'
                    }
                ],
            }
        ]
    },
    output: {
        path: helpers.root('dist'),
        publicPath: 'http://localhost:8080/',
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