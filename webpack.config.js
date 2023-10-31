const path = require('path')
const srcPath = path.join(__dirname, 'src')
const outputPath = path.join(__dirname, 'build')
const widgetWebpack = require('materia-widget-development-kit/webpack-widget')

const rules = widgetWebpack.getDefaultRules()
const copy = widgetWebpack.getDefaultCopyList()

const entries = {
	'creator': [
		path.join(srcPath, 'templates', 'creator.html'),
		path.join(srcPath, 'js', 'creator.js'),
		path.join(srcPath, 'js', 'player-template-controller.js'),
		path.join(srcPath, 'sass', 'main.scss'),
		path.join(srcPath, 'sass', 'creator.scss'),
		path.join(srcPath, 'sass', 'player.scss'),
	],
	'player': [
		path.join(srcPath, 'templates', 'player.html'),
		path.join(srcPath, 'js', 'player.js'),
		path.join(srcPath, 'templates', 'player.template.js'),
		path.join(srcPath, 'sass', 'main.scss'),
		path.join(srcPath, 'sass', 'player.scss'),
	],
	'player.template': [
		path.join(srcPath, 'templates', 'player.template.html')
	]
}

const babelLoaderWithPolyfillRule = {
	test: /\.js$/,
	exclude: /node_modules/,
	use: {
		loader: 'babel-loader',
		options: {
			presets: ['@babel/preset-env']
		}
	}
}

let customRules = [
	rules.copyImages,
	rules.loadHTMLAndReplaceMateriaScripts,
	rules.loadAndPrefixSASS,
	babelLoaderWithPolyfillRule
]

const customCopy = copy.concat([
	{
		from: path.join(__dirname, 'node_modules', 'jsxgraph', 'distrib', 'jsxgraphcore.js'),
		to: path.join(outputPath, 'vendor', 'jsxgraph')
	},
	{
		from: path.join(__dirname, 'node_modules', 'mathquill', 'build'),
		to: path.join(outputPath, 'vendor', 'mathquill')
	},
	{
		from: path.join(__dirname, 'src','_guides','assets'),
		to: path.join(outputPath, 'guides', 'assets'),
		toType: 'dir'
	}
])

// options for the build
let options = {
	entries: entries,
	moduleRules: customRules,
	copyList: customCopy
}

const ourFinalWebpackConfig = widgetWebpack.getLegacyWidgetBuildConfig(options)

module.exports = ourFinalWebpackConfig

