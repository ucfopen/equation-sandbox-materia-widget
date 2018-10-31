const path = require('path')
const srcPath = path.join(__dirname, 'src') + path.sep
const outputPath = path.join(__dirname, 'build')
const widgetWebpack = require('materia-widget-development-kit/webpack-widget')
const WebpackSyncShellPlugin = require('webpack-synchronizable-shell-plugin')

const rules = widgetWebpack.getDefaultRules()
const copy = widgetWebpack.getDefaultCopyList()
const entries = {}

entries['assets/js/creator.js'] = [
	path.join(__dirname, 'src', 'js', 'creator.js')
]
entries['assets/js/player.js'] = [
	path.join(__dirname, 'src', 'js', 'player.js')
]
entries['assets/js/player-template-controller.js'] = [
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

const babelLoaderRule = {
	test: /\.js$/,
	exclude: [/node_modules/],
	use: {
		loader: 'babel-loader',
		options: {
			presets: ['env']
		}
	}
}

let customRules = [
	// rules.loaderDoNothingToJs,
	//rules.loaderCompileCoffe,
	rules.copyImages,
	rules.loadHTMLAndReplaceMateriaScripts,
	rules.loadAndPrefixCSS,
	rules.loadAndPrefixSASS,
	babelLoaderRule
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

