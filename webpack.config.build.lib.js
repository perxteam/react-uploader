"use strict";
var webpack = require('webpack');
var path = require('path');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var loaders = require('./webpack.loaders');

const HOST = process.env.HOST || "0.0.0.0";
const PORT = process.env.PORT || "8888";

module.exports = {
	entry: [
		`webpack-dev-server/client?http://${HOST}:${PORT}`, // WebpackDevServer host and port
		`webpack/hot/only-dev-server`,
    process.env.APP_TYPE === 'viewer'
      ? './app/entrypoints/formViewer.js'
      : './app/entrypoints/formBuilder.js'
	],
	devtool: 'source-map',
	output: {
		path: path.join(__dirname, 'public'),
		filename: 'bundle.js'
	},
	resolve: {
    modulesDirectories: [
      'app',
      'node_modules',
      'assets',
    ],
    alias: {
      components: './app/components',
      containers: './app/containers',
      entrypoints: './app/entrypoints',
      data: './app/data',
      actions: './app/actions',
      scenes: './app/scenes',
      redux: './app/redux',
      utils: './app/utils',
      assets: './app/assets',
    },
		extensions: ['', '.js', '.jsx', '.scss'],
	},
	module: {
    loaders,
    preLoaders: [
      {test: /\.js$/, loader: "eslint-loader?fix=true", exclude: /node_modules/}
    ]
	},
  sassLoader: {
    includePaths: [path.resolve(__dirname, "./assets/sass")]
  },
	devServer: {
		contentBase: "./public",
		noInfo: true, //  --no-info option
		hot: true,
		inline: true,
		port: PORT,
		host: HOST,
    historyApiFallback: true,
	},
	plugins: [
//		new webpack.NoErrorsPlugin(),
		new webpack.HotModuleReplacementPlugin(),
		new CopyWebpackPlugin([
			{from: './index.html'}
		]),
	]
};
