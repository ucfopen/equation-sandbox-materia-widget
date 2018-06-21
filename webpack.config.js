const path = require('path')
// const latex = require('!pegjs!pegjs-loader')
const latex = require('pegjs-loader')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

let srcPath = path.join(process.cwd(), 'src')
let outputPath = path.join(process.cwd(), 'build')

let overrideConfig = {preCopy: [
	{
		from: srcPath+'/app.js',
		to: outputPath,
	},
	{
		from: srcPath+'/tests',
		to: outputPath,
		toType: 'dir'
	},
	{
		from: srcPath+'/peg',
		to: outputPath+'/peg',
		toType: 'dir'
	},
	{
		from: srcPath+'/templates',
		to: outputPath,
		toType: 'dir'
	}
]}

// load the reusable legacy webpack config from materia-widget-dev
let webpackConfig = require('materia-widget-development-kit/webpack-widget').getLegacyWidgetBuildConfig(overrideConfig)

delete webpackConfig.entry['creator.js']
delete webpackConfig.entry['player.js']
delete webpackConfig.entry['creator.css']
delete webpackConfig.entry['player.css']

webpackConfig.entry['assets/js/creator.js'] = [
	path.join(__dirname, 'src', 'coffee', '_bootstrap.coffee'),
	path.join(__dirname, 'src', 'coffee', 'creator.coffee')
]
webpackConfig.entry['assets/js/player.js'] = [
	path.join(__dirname, 'src', 'coffee', '_bootstrap.coffee'),
	path.join(__dirname, 'src', 'coffee', 'player.coffee')
]
webpackConfig.entry['assets/js/playerTemplateController.js'] = [
	path.join(__dirname, 'src', 'coffee', 'playerTemplateController.coffee'),
	path.join(__dirname, 'src', 'peg', 'latex.pegjs'),
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

webpackConfig.entry['peg/latex.pegjs'] = [
	path.join(__dirname, 'src', 'peg', 'latex.pegjs'),
]

webpackConfig.module.rules.push({
	test: /\.pegjs$/,
	exclude: /node_modules/,
	loader: ExtractTextPlugin.extract({
		use: [
			{
				loader: 'raw-loader'
			},
			{
				loader: 'pegjs-loader',
				options: { cache: true }
			}
		]
	})
})

module.exports = webpackConfig
