const path = require('path')
const srcPath = path.join(__dirname, 'src') + path.sep
const outputPath = path.join(__dirname, 'build')
const widgetWebpack = require('materia-widget-development-kit/webpack-widget')
const WebpackSyncShellPlugin = require('webpack-synchronizable-shell-plugin')

const rules = widgetWebpack.getDefaultRules()
const copy = widgetWebpack.getDefaultCopyList()
const entries = {}

const shims = [
	'core-js/es6/symbol'
]

entries['assets/js/creator.js'] = [
	...shims,
	path.join(__dirname, 'src', 'js', 'creator.js')
]
entries['assets/js/player.js'] = [
	...shims,
	path.join(__dirname, 'src', 'js', 'player.js')
]
entries['assets/js/player-template-controller.js'] = [
	...shims,
	path.join(__dirname, 'src', 'js', 'player-template-controller.js'),
]
entries['assets/stylesheets/creator.css'] = [
	path.join(__dirname, 'src', 'sass', 'creator.scss'),
	path.join(__dirname, 'src', 'templates', 'creator.html')
]
entries['assets/stylesheets/player.css'] = [
	path.join(__dirname, 'src', 'sass', 'player.scss'),
	path.join(__dirname, 'src', 'templates', 'player.html'),
	path.join(__dirname, 'src', 'templates', 'player.template.html')
]
entries['assets/css/main.css'] = [
	path.join(__dirname, 'src', 'sass', 'main.scss'),
]
entries['guides/creator.temp.html'] = [
	path.join(__dirname, 'src', '_guides', 'creator.md')
]
entries['guides/player.temp.html'] = [
	path.join(__dirname, 'src', '_guides', 'player.md')
]

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
	rules.loadAndPrefixCSS,
	rules.loadAndPrefixSASS,
	rules.loadAndCompileMarkdown,
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

ourFinalWebpackConfig.plugins.push(new WebpackSyncShellPlugin({
	onBuildStart: {
		scripts: ['yarn peg:build'],
		blocking: true,
		parallel: false
	}
}))

module.exports = ourFinalWebpackConfig

