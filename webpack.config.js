const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const HtmlWebpackPlugin = require('html-webpack-plugin');

const HOST = process.env.HOST || '0.0.0.0';
const PORT = process.env.PORT || '8810';
const nodeEnv = process.argv.indexOf('-p') === -1 ? 'development' : 'production';
const isProd = nodeEnv === 'production'


const sourcePath = path.join(__dirname, './app');
const jsEntry = path.join(sourcePath, '/index.js')

const staticsPath = process.env.APP_TYPE === 'viewer'
  ? path.join(__dirname, './public/viewer')
  : path.join(__dirname, './public/builder')

function getFilename(filename) {
//  return isProd ? filename.replace(/\.([^.]+)$/,".[chunkhash].$1") : filename
  return filename
}

function getExtractTextPlugin(filename) {
  return new ExtractTextPlugin({
    filename: getFilename(filename),
    disable: false,
    allChunks: true,
  });
}

const extractCSS = getExtractTextPlugin('styles.css')
const extractSASS = getExtractTextPlugin('styles-common.css')

const plugins = [
  new webpack.optimize.CommonsChunkPlugin({
    name: 'vendor',
    filename: getFilename('vendor.bundle.js'),
    minChunks(module, count) {
      var context = module.context;
      return context && context.indexOf('node_modules') >= 0;
    },
  }),
  new webpack.optimize.CommonsChunkPlugin({
    name: 'manifest',
  }),
  new webpack.optimize.CommonsChunkPlugin({
    async: 'used-twice',
    minChunks(module, count) {
      return count >= 2;
    },
  }),
  new webpack.DefinePlugin({
		'process.env': { NODE_ENV: JSON.stringify(nodeEnv) }
	}),
  new HtmlWebpackPlugin({
    inject: false,
    widgetId: 'files-uploader',
    title: 'React files uploader',
    template: path.join(__dirname, 'index.ejs')
  }),
	extractCSS,
  extractSASS
];

const cssLoader = {
  loader: 'css-loader',
}

if (isProd) {
  plugins.push(
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false
    }),
		new CopyWebpackPlugin([
			{ from: './index.html' },
      {
        from: './static/',
        to: './static/'
      }
    ])
  )
} else {
  plugins.push(
//    new BundleAnalyzerPlugin({
//      analyzerMode: 'static'
//    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin()
  )
}

module.exports = {
  devtool: isProd ? 'source-map' : 'source-map',
  entry: jsEntry,
  output: {
    filename: getFilename('[name].js'),
		chunkFilename: getFilename('[name]-chunk.js'),
    path: staticsPath,
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        use: {
          loader: 'file-loader',
          query: {
            name: '[name].[ext]'
          }
        }
      },
      {
        test:  /\.scss$/,
        use: isProd
        ? extractSASS.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'sass-loader'],
        })
        : ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.css$/,
        use: isProd
        ? extractCSS.extract({
          fallback: 'style-loader',
          use: [cssLoader],
        })
        : ['style-loader', cssLoader],
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            query: {
              cacheDirectory: true,
              presets: [['es2015', {modules: false}], 'react', 'stage-0'],
              babelrc: false,
              plugins: [
                'syntax-dynamic-import',
                'transform-decorators-legacy',
              ]
            }
          }
        ]
      },
//      {
//        test: /\.js$/,
//        enforce: 'pre',
//        use: [
//          {
//            loader: 'eslint-loader',
//            query: {
//              fix: true,
//            }
//          }
//        ],
//        exclude: /node_modules/,
//      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)$/,
        loader: 'file-loader?name=fonts/[name].[ext]'
      }
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx', '.scss'],
    alias: {
      'react': path.join(__dirname, 'node_modules', 'react'),
      'react-dom': path.join(__dirname, 'node_modules', 'react-dom')
    },
    modules: [
      sourcePath,
      './assets',
      'node_modules'
    ]
  },
  plugins: plugins,
  devServer: {
    contentBase: '.',
    publicPath: '/',
    historyApiFallback: true,
		port: PORT,
		host: HOST,
    hot: true,
    inline: true,
    compress: isProd,
    stats: {
      colors: true,
      chunks: false, // be less verbose
    },
  },
  externals: {
		'cheerio': 'window',
		'react/addons': true, // important!!
		'react/lib/ExecutionEnvironment': true,
		'react/lib/ReactContext': true
	}
};
