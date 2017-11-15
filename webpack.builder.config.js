var webpack = require('webpack');
var path = require('path');
var loaders = require('./webpack.loaders');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	entry: [
    `./app/entrypoints/formBuilder.js` // Your appʼs entry point
	],
	output: {
    path: path.join(__dirname, 'public/builder'),
		filename: 'schemaFormBuilder.js'
	},
	resolve: {
    modulesDirectories: [
      'app',
      'node_modules',
      'assets',
    ],
		extensions: ['', '.js', '.jsx', '.scss'],
	},
	module: {
		loaders: loaders
	},
	plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new webpack.optimize.CommonsChunkPlugin({
      children: true,
      async: true
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      beautify: false,
      comments: false,
      compress: {
        sequences: true,
        booleans: true,
        loops: true,
        unused: true,
        warnings: false,
        drop_console: true,
        unsafe: true
      }
    }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new HtmlWebpackPlugin({
      inject: false,
      title: 'Form Builder Test Page',
      template: 'index-build.ejs',
    })
	]
};
