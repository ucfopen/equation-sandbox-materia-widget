const WebpackSyncShellPlugin = require('webpack-synchronizable-shell-plugin')
const path = require('path')

let srcPath = path.join(process.cwd(), 'src')
let outputPath = path.join(process.cwd(), 'build')

// load the reusable legacy webpack config from materia-widget-dev
let webpackConfig = require('materia-widget-development-kit/webpack-widget').getLegacyWidgetBuildConfig()

delete webpackConfig.entry['creator.js']
delete webpackConfig.entry['player.js']
delete webpackConfig.entry['creator.css']
delete webpackConfig.entry['player.css']

webpackConfig.module.rules[0] = {
  test: /\.js$/i,
  exclude: /node_modules/,
  use: {
	loader: 'babel-loader'
  }
}

webpackConfig.entry['assets/js/creator.js'] = [
	path.join(__dirname, 'src', 'js', 'creator.js')
]
webpackConfig.entry['assets/js/player.js'] = [
	path.join(__dirname, 'src', 'js', 'player.js')
]
webpackConfig.entry['assets/js/player-template-controller.js'] = [
	path.join(__dirname, 'src', 'js', 'player-template-controller.js'),
]
webpackConfig.entry['assets/stylesheets/creator.css'] = [
	path.join(__dirname, 'src', 'sass', 'creator.scss'),
	path.join(__dirname, 'src', 'templates', 'creator.html')
]
webpackConfig.entry['assets/stylesheets/player.css'] = [
	path.join(__dirname, 'src', 'sass', 'player.scss'),
	path.join(__dirname, 'src', 'templates', 'player.html'),
	path.join(__dirname, 'src', 'templates', 'player.template.html')
]
webpackConfig.entry['assets/css/main.css'] = [
	path.join(__dirname, 'src', 'sass', 'main.scss'),
]

webpackConfig.module.rules.push({
	test: /\.js$/,
	exclude: [/node_modules/],
	use: {
		loader: 'babel-loader',
		options: {
			presets: ['env']
		}
	}
})

webpackConfig.plugins.push(new WebpackSyncShellPlugin({
	onBuildStart: {
		scripts: ['yarn peg:build'],
		blocking: true,
		parallel: false
	}
}))

module.exports = webpackConfig
