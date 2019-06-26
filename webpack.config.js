const path = require('path');
const BUILD_FOLDER = 'dist';

module.exports = {
	entry: "./src/index.js",
	output: {
		path: path.resolve(__dirname, BUILD_FOLDER),
		filename: "bundle.js",
		libraryTarget: "umd"
	},
	module: {
		rules: [{
			test: /\.js$/,
	        include: path.resolve(__dirname, 'src'),
			use: {
				loader: 'babel-loader',
			},
		}]
	},
	externals: {
		preact: "preact"
	}
};
