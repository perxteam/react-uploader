module.exports = [
  {
    test: /\.json$/,
    loader: 'json'
  },
	{
		test: /\.jsx?$/,
		exclude: /(node_modules|bower_components)/,
		loader: 'babel',
		query: {
      babelrc: false,
      presets: ["es2015", "react", "stage-0"],
      plugins: [
        "react-hot-loader/babel",
        "transform-decorators-legacy",
      ]
    }
	},
	{
		test: /\.css$/,
		loader: 'style-loader!css-loader'
	},
	{
		test: /\.scss$/,
		loader: 'style-loader!css-loader!sass-loader'
	},
	{
    test: /\.(eot|svg|ttf|woff|woff2)$/,
    loader: 'file?name=fonts/[name].[ext]'
	},
	{
		test: /\.gif/,
		loader: "url-loader?limit=10000&mimetype=image/gif"
	},
	{
		test: /\.jpg/,
		loader: "url-loader?limit=10000&mimetype=image/jpg"
	},
	{
		test: /\.png/,
		loader: "url-loader?limit=10000&mimetype=image/png"
	}
];
