var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const devMode = process.env.NODE_ENV !== 'production'
var helpers = require('./helpers');

// function isExternal(module) {
//     var userRequest = module.userRequest;
//
//     console.log( 'isExternal: ', userRequest);
//
//     if (typeof userRequest !== 'string') {
//         return false;
//     }
//
//     return userRequest.indexOf('bower_components') >= 0 ||
//         userRequest.indexOf('node_modules') >= 0 ||
//         userRequest.indexOf('libraries') >= 0;
// }
//
// var bpmn = [
//     './src/bpmn.ts',
//     'bpmn-js',
//     'diagram-js',
//     'diagram-js/lib/features/global-connect/GlobalConnect.js',
//     'diagram-js-direct-editing',
// ];

module.exports = {
  entry: {
    'polyfills': './src/polyfills.ts',
    'vendor': './src/vendor.ts',
    // 'bpmn': bpmn,
    'bpmn': './src/bpmn.ts',
    'app': './src/main.ts'
  },

  resolve: {
    extensions: ['.ts', '.js', '.json', '.less', '.css', '.html']
  },

  module: {
    rules: [ // {
      //     test: /\.js$/,
      //     loaders: ['awesome-typescript-loader', 'angular2-template-loader']
      // },
      {
        test: /\.ts$/,
        use: [{
          loader: 'awesome-typescript-loader'
        }, {
          loader: 'angular2-template-loader'
        }]
      }, {
        test: /\.html$/,
        use: [{
          loader: 'html-loader'
        }]
      }, {
        test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)(\?\d+)?$/,
        use: [{
          loader: 'file-loader',

          options: {
            name: 'graphics/[name].[ext]'
          }
        }]
      }, {
        test: /\.css$/,
        use: [{
            loader: MiniCssExtractPlugin.loader,
            options: {
              // you can specify a publicPath here
              // by default it use publicPath in webpackOptions.output
              publicPath: '../'
            }
          },
          "css-loader"
        ]
      }, {
        test: /\.bpmn$/,
        use: [{
          loader: 'file-loader',

          options: {
            name: 'diagrams/[name].[ext]'
          }
        }]
      }, {

        test: /\.(sa|sc)ss$/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader',
        ],

        // test: /\.css$/,
        // exclude: helpers.root('src', 'app'),
        // use: ExtractTextPlugin.extract({
        //     fallback: 'style',
        //     use: 'css?sourceMap'
        // })
      }, {
        // test: /\.less$/,
        // exclude: /node_modules/,
        // use: [{
        //   loader: 'raw-loader'
        // }, {
        //   loader: 'less-loader'
        // }]
      }
    ]
  },

  plugins: [
    new webpack.NamedModulesPlugin(),
    // new optimization.splitChunks({
    //   name: ['app', 'bpmn', 'vendor', 'polyfills'],
    //   // minChunks: function(module) {
    //   //     return isExternal(module);
    //   // }
    // }),
    new HtmlWebpackPlugin({
      template: 'src/index.html'
    }),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: devMode ? '[name].css' : '[name].[hash].css',
      chunkFilename: devMode ? '[id].css' : '[id].[hash].css',
    })
  ]
};