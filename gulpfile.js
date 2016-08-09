var argv = require('yargs').argv;
var autoprefix = require('gulp-autoprefixer');
var clean = require('gulp-clean');
var clone = require('gulp-clone');
var coffee = require('gulp-coffee');
var concat = require('gulp-concat');
var cssmin = require('gulp-cssmin');
var del = require('del');
var exec = require('child_process').exec;
var fs = require('fs');
var gulp = require('gulp');
var gutil = require('gulp-util');
var ngAnnotate = require('gulp-ng-annotate');
var print = require('gulp-print');
var rename = require('gulp-rename');
var replace = require('gulp-replace');
var replaceTask = require('gulp-replace-task');
var runSequence = require('run-sequence');
var sass = require('gulp-sass');
var shell = require('gulp-shell');
var uglify = require('gulp-uglify');
var zip = require('gulp-zip');

var configs = require('../../backend/config.json');

var widget = sanitize("equation-sandbox");
// When compiling this may be entered as an argument.
var minify = argv.minify;
var mangle = argv.mangle;
var embed = argv.embed;

var Embedding = (embed === "false") ? false : true;
var Mangling = (mangle === "false") ? false : true;
var Minifying = (minify === "false") ? false : true;

var sourceString = "";

var materiaJsReplacements = [
	{match: /src="materia.enginecore.js"/g, replacement: function() {return 'src="../../../js/materia.enginecore.js"';} },
	{match: /src="materia.score.js"/g, replacement: 'src="../../../js/materia.score.js"'},
	{match: /src="materia.creatorcore.js"/g, replacement: 'src="../../../js/materia.creatorcore.js"'},
	{match: /src="materia.creatorcore.js"/g, replacement: 'src="../../../js/materia.creatorcore.js"'},
	{match: /src="materia.storage.manager.js"/g, replacement: 'src="../../../js/materia.storage.manager.js"'},
	{match: /src="materia.storage.table.js"/g, replacement: 'src="../../../js/materia.storage.table.js"'}
];

// Cleans folder of any old files before populating with the newest run.
gulp.task('clean:pre', function()
{
	gutil.log("Clean:pre Running");
	return gulp.src([sourceString + '.build/'])
				.pipe( clean() )
				.on('error', function(msg) {console.log("clean:pre Fail Error: ", msg.toString());})
				.pipe( print() );
});
// Removes old zip file before creating new one.
gulp.task('clean:package', function()
{
	gutil.log("Clean:package Running");
	return gulp.src(sourceString + '.build/_output/' + widget + '.zip')
				.pipe( clean({force: true}) )
				.on('error', function(msg) {console.log("clean:package Fail Error: ", msg.toString());})
				.pipe( print() );
});
// Transpiles Coffeescript files into Javascript files.
gulp.task('coffee', function()
{
	gutil.log("Coffee Running");
	// Engine
	return gulp.src([sourceString + 'src/coffee/*.coffee'])
				.pipe( coffee({bare: true}) )
				.on('error', function(msg) {console.log("coffee Fail Error: ", msg.toString());})
				.pipe( print() )
				.pipe(gulp.dest(sourceString + '.build/assets/js/'));
});
// Squish those files and assets into that zip file
gulp.task('compress', function()
{
	gutil.log("Compress Running");
	return gulp.src([sourceString + '.build/**/*',
					'!' + sourceString + '.build/*.coffee',
					'!' + sourceString + '.build/**/*.coffee',
					'!' + sourceString + '.build/*.scss',
					'!' + sourceString + '.build/**/*.scss',
					'!' + sourceString + '.build/*.less',
					'!' + sourceString + '.build/**/*.less',
					'!' + sourceString + '.build/*.jade',
					'!' + sourceString + '.build/**/*.jade',
					'!' + sourceString + '.build/*.zip',
					'!' + sourceString + '.build/*.wigt',])
				.pipe( print() )
				.pipe( zip( widget + '.zip' ) )
				.on('error', function(msg) {console.log("compress Fail Error: ", msg.toString());})
				.pipe(gulp.dest(sourceString + '.build/_output/'));
});
// Copy files and assets in the beginning
gulp.task('copy:init-assets', function()
{
	gutil.log("Copy:init-assets Running");
	// Copy assets
	return gulp.src([sourceString + 'src/assets/*', sourceString + 'src/assets/**/*'])
				.on('error', function(msg) {console.log("copy:init Fail Error: ", msg.toString());})
				.pipe( print() )
				.pipe(gulp.dest(sourceString + '.build/assets/'));
});
// Copy files and assets in the beginning
gulp.task('copy:init-baseWidgetFiles', function()
{
	gutil.log("Copy:init-baseWidgetFiles Running");
	// Copy non-prepocessed files
	return gulp.src([sourceString + 'src/install.yaml',
					sourceString + 'src/demo.json',
					sourceString + 'src/*.html',
					sourceString + 'src/*.js',
					sourceString + 'src/*.css',
					sourceString + 'src/tests/',
					sourceString + 'src/templates/',
					sourceString + 'src/peg/'])
				.on('error', function(msg) {console.log("copy:init Fail Error: ", msg.toString());})
				.pipe( print() )
				.pipe(gulp.dest(sourceString + '.build/'));
});
// Copy files and assets in the beginning
gulp.task('copy:init-tests', function()
{
	gutil.log("Copy:init-tests Running");
	// Copy non-prepocessed files
	return gulp.src([sourceString + 'src/tests/', sourceString + 'src/tests/*.*'])
				.on('error', function(msg) {console.log("copy:init Fail Error: ", msg.toString());})
				.pipe( print() )
				.pipe(gulp.dest(sourceString + '.build/tests/'));
});
// Copy files and assets in the beginning
gulp.task('copy:init-templates', function()
{
	gutil.log("Copy:init-templates Running");
	// Copy non-prepocessed files
	return gulp.src([sourceString + 'src/templates/', sourceString + 'src/templates/*.*'])
				.on('error', function(msg) {console.log("copy:init Fail Error: ", msg.toString());})
				.pipe( print() )
				.pipe(gulp.dest(sourceString + '.build/templates/'));
});
// Copy fonts in the beginning
gulp.task('copy:init-fonts', function()
{
	gutil.log("Copy:init-fonts Running");
	// Copy non-prepocessed files
	return gulp.src([sourceString + 'src/assets/vendor/mathquill-0.9.4/font/*.*'])
				.on('error', function(msg) {console.log("copy:init Fail Error: ", msg.toString());})
				.pipe( print() )
				.pipe(gulp.dest(sourceString + '.build/font/'));
});
// Copy files and assets in the beginning
gulp.task('copy:init-peg', function()
{
	gutil.log("Copy:init-peg Running");
	// Copy non-prepocessed files
	return gulp.src([sourceString + 'src/peg/', sourceString + 'src/peg/*.*'])
				.on('error', function(msg) {console.log("copy:init Fail Error: ", msg.toString());})
				.pipe( print() )
				.pipe(gulp.dest(sourceString + '.build/peg/'));
});
// Copy files and assets in the beginning
gulp.task('copy:init-export', function()
{
	gutil.log("Copy:init-export Running");
	// Copy Files
	return gulp.src([sourceString + 'src/_export/export_module.php'])
				.on('error', function(msg) {console.log("copy:init Fail Error: ", msg.toString());})
				.pipe( print() )
				.pipe(gulp.dest(sourceString + '.build/_export/'));
});
// Copy files and assets in the beginning
gulp.task('copy:init-icons', function()
{
	gutil.log("Copy:init-icons Running");
	// Copy assets
	return gulp.src([sourceString + 'src/_icons/*'])
				.on('error', function(msg) {console.log("copy:init Fail Error: ", msg.toString());})
				.pipe( print() )
				.pipe(gulp.dest(sourceString + '.build/img/'));
});
// Copy files and assets in the beginning
gulp.task('copy:init-playdata', function()
{
	gutil.log("Copy:init-playdata Running");
	// Copy Files
	return gulp.src([sourceString + 'src/_exports/playdata_exporters.php'])
				.on('error', function(msg) {console.log("copy:init Fail Error: ", msg.toString());})
				.pipe( print() )
				.pipe(gulp.dest(sourceString + '.build/_exports/'));
});
// Copy files and assets in the beginning
gulp.task('copy:init-screenshots', function()
{
	gutil.log("Copy:init-screenshots Running");
	// Copy assets
	return gulp.src([sourceString + 'src/_screen-shots/*'])
				.on('error', function(msg) {console.log("copy:init Fail Error: ", msg.toString());})
				.pipe( print() )
				.pipe(gulp.dest(sourceString + '.build/img/screen-shots/'));
});
// Copy files and assets in the beginning
gulp.task('copy:init-score', function()
{
	gutil.log("Copy:init-score Running");
	// Copy Files
	return gulp.src([sourceString + 'src/_score/*.*'])
				.on('error', function(msg) {console.log("copy:init Fail Error: ", msg.toString());})
				.pipe( print() )
				.pipe(gulp.dest(sourceString + '.build/_score-modules/'));
});
// Copy files and assets in the beginning
gulp.task('copy:init-spec', function()
{
	gutil.log("Copy:init-spec Running");
	// Copy Files
	return gulp.src([sourceString + 'src/spec/*.*'])
				.on('error', function(msg) {console.log("copy:init Fail Error: ", msg.toString());})
				.pipe( print() )
				.pipe(gulp.dest(sourceString + '.build/spec/'));
});
gulp.task('creator-css', ['sass'], function() {
	return gulp
		.src([sourceString + '.build/assets/css/creator.css'])
		.pipe(concat('./creator.css'))
		.pipe(gulp.dest(sourceString + '.build/assets/stylesheets/'));
});
gulp.task('player-css', ['sass'], function() {
	return gulp
		.src([sourceString + '.build/assets/css/player.css'])
		.pipe(concat('./player.css'))
		.pipe(gulp.dest(sourceString + '.build/assets/stylesheets/'));
});
gulp.task('creator-js', ['coffee', 'peg'], function() {
	return gulp
		.src([	sourceString + '.build/assets/js/_bootstrap.js',
				sourceString + '.build/assets/js/latex.js',
				sourceString + '.build/assets/js/creator.js'])
		.pipe(concat('creator.js'))
		.pipe(gulp.dest(sourceString + '.build/assets/scripts/'))
});
gulp.task('creator-min-js', ['creator-js'], function() {
	return gulp
		.src(sourceString + '.build/assets/scripts/creator.js')
		.pipe(uglify())
		.pipe(concat('creator.min.js'))
		.pipe(gulp.dest(sourceString + '.build/assets/scripts/'))
});
gulp.task('player-js', ['coffee', 'peg'], function() {
	return gulp
		.src([	sourceString + '.build/assets/js/_bootstrap.js',
				sourceString + '.build/assets/js/latex.js',
				sourceString + '.build/assets/js/player.js'])
		.pipe(concat('player.js'))
		.pipe(gulp.dest(sourceString + '.build/assets/scripts/'))
});
gulp.task('player-min-js', ['player-js'], function() {
	return gulp
		.src(sourceString + '.build/assets/scripts/player.js')
		.pipe(uglify())
		.pipe(concat('player.min.js'))
		.pipe(gulp.dest(sourceString + '.build/assets/scripts/'))
});
gulp.task('player-controller-js', ['coffee', 'peg'], function() {
	return gulp
		.src([sourceString + '.build/assets/js/playerTemplateController.js'])
		.pipe(concat('player.js'))
		.pipe(gulp.dest(sourceString + '.build/assets/scripts/'))
});
// Minifies the project css files
gulp.task('cssmin', function()
{
	if(Minifying)
	{
		gutil.log("CSS Min Running");
		return gulp.src([sourceString + '.build/**/*.css'])
					.pipe( cssmin() )
					.on('error', function(msg) {console.log("copy:init Fail Error: ", msg.toString());})
					.pipe( print() )
					.pipe(gulp.dest(sourceString + '.build/'));
	}
	return "";
});
gulp.task('build-player', function() {
	return gulp
		.src([	sourceString + '.build/templates/player.html',
				sourceString + '.build/templates/player.template.html'])
		.pipe(concat(sourceString + '.build/player.html'))
		.pipe(gulp.dest(sourceString + '.build/'))
});
gulp.task('build-creator', function() {
	return gulp
		.src([	sourceString + '.build/templates/creator.html',
				sourceString + '.build/templates/player.template.html'])
		.pipe(concat(sourceString + '.build/creator.html'))
		.pipe(gulp.dest(sourceString + '.build/'))
});
// Injects css and js files into the html
gulp.task('embed', function()
{
	if(Embedding && Minifying)
	{
		gutil.log("Embed Running");
		return gulp.src(sourceString + '.build/*.html')
					.pipe(replace(/<link href="player.css"[^>]*>/, function(s) {
						var style = fs.readFileSync(sourceString + '.build/player.css', 'utf8');
						return '<style>\n' + style + '\n</style>';
					}))
					.pipe(replace(/<link href="creator.css"[^>]*>/, function(s) {
						var style = fs.readFileSync(sourceString + '.build/creator.css', 'utf8');
						return '<style>\n' + style + '\n</style>';
					}))
					.pipe(replace(/<script src=\"player.js\"><\/script>/, function(s) {
						var script = fs.readFileSync(sourceString + '.build/player.js', 'utf8');
						return '<script>\n' + script + '\n</script>';
					}))
					.pipe(replace(/<script src=\"creator.js\"><\/script>/, function(s) {
						var script = fs.readFileSync(sourceString + '.build/creator.js', 'utf8');
						return '<script>\n' + script + '\n</script>';
					}))
					.on('error', function(msg) {console.log("inject Fail Error: ", msg.toString());})
					.pipe( print() )
					.pipe(gulp.dest(sourceString + '.build/'));
	}
	return "";
});
// Shows the syntax of the build command to the user.
gulp.task('help', function()
{
	showDocs();
});
// Replaces all of the (internally sourced) script tags in the player/creator files with
// a combined script tag referenceing a single player.js/creator.js source
gulp.task('minify-player-js', function()
{
	if(Embedding && Minifying)
	{
		gutil.log("Minify Player JS Running");
		return minifyJs("player");
	}
	return "";
});
gulp.task('minify-creator-js', function()
{
	if(Embedding && Minifying)
	{
		gutil.log("Minify Creator JS Running");
		return minifyJs("creator");
	}
	return "";
});
function minifyJs(htmlName)
{
	var assets = [];
	var data = fs.readFileSync(sourceString + '.build/' + htmlName + '.html');
	data.toString().replace(/<script.*src=\"(?!assets\/vendor\/jsxgraphcore|assets\/vendor\/jquery.min.js|assets\/vendor\/mathquill-0.9.4\/mathquill.min.js|assets\/vendor\/angular.min.js)(.*)"(.*)>/g, function(toreplace)
	{
		if(toreplace.indexOf("//") != -1) return toreplace;
		if(toreplace.indexOf("materia.") != -1) return toreplace;
		if(toreplace.indexOf("data-embed='false'") != -1) return toreplace;
		if(toreplace.indexOf("data-embed=\"false\"") != -1) return toreplace;
		assets.push(sourceString + '.build/' + arguments['1']);
		return "";
	});

	return gulp.src(assets)
				.pipe( print() )
				.pipe(concat(htmlName + ".js"))
				.pipe( print() )
				.pipe(gulp.dest(sourceString + '.build/'));
}
// Replaces all of the (internally sourced) link tags in the player/creator files with
// a combined link tag referenceing a single player.css/creator.css source
gulp.task('minify-player-css', function()
{
	if(Embedding && Minifying)
	{
		gutil.log("Minify Player CSS Running");
		return minifyCss("player");
	}
	return "";
});
gulp.task('minify-creator-css', function()
{
	if(Embedding && Minifying)
	{
		gutil.log("Minify Creator CSS Running");
		return minifyCss("creator");
	}
	return "";
});
function minifyCss(htmlName)
{
	var assets = [];
	var data = fs.readFileSync(sourceString + '.build/' + htmlName + '.html');
	data.toString().replace(/<link.*href=[\'|\"](.*)[\'|\"](.*)>/g, function(toreplace)
	{
		if(toreplace.indexOf("//") != -1) return toreplace;
		if(toreplace.indexOf("materia.") != -1) return toreplace;
		if(toreplace.indexOf("data-embed='false'") != -1) return toreplace;
		if(toreplace.indexOf("data-embed=\"false\"") != -1) return toreplace;
		assets.push(sourceString + '.build/' + arguments['1']);
		return "";
	});
	return gulp.src(assets)
				.pipe( print() )
				.pipe(concat(htmlName + ".css"))
				.pipe( print() )
				.pipe(gulp.dest(sourceString + '.build/'));
}
// Pre-minifies any Angular app js files.
gulp.task('ngAnnotate', function()
{
	gutil.log("NgAnnotate Running");
	return gulp.src([sourceString + '.build/*.js', '!' + sourceString + '.build/*.min.js', '!' + sourceString + '.build/*.pack.js'])
				.pipe(ngAnnotate())
				.on('error', function(msg) {console.log("ngmin Fail Error: ", msg.toString());})
				.pipe( print() )
				.pipe(gulp.dest(sourceString + '.build/'));
});
// -e option sets the exported variable from modules.exports to window.latexParser
// --cache option turns on memoization, without it expressions like "\sin()" can
// hang the browser really bad (see https://github.com/pegjs/pegjs/issues/205)
gulp.task('peg', shell.task(['./sandbox/equation-sandbox/node_modules/pegjs/bin/pegjs -e window.latexParser --cache ./sandbox/equation-sandbox/.build/peg/latex.peg ./sandbox/equation-sandbox/.build/assets/js/latex.js'
]));
// Copy zipped package into the "output" folder
gulp.task('rename:ext', function()
{
	gutil.log("Rename Ext Running");
	return gulp.src([sourceString + '.build/_output/*.zip'])
				.pipe( rename({ extname: '.wigt' }))
				.on('error', function(msg) {console.log("rename:ext Fail Error: ", msg.toString());})
				.pipe( print() )
				.pipe(gulp.dest(sourceString + '.build/_output/'));
});
// Replaces file path data based off of preset patterns.
gulp.task('replace:build', function()
{
	gutil.log("Replace Build Running");
	return gulp.src([sourceString + '.build/*.html'])
				.pipe(replaceTask( { patterns: [
									{match: /\n\t/g, replacement: ''},
									{match: /\s{2,}/g, replacement: ' '}
								] } ))
				.on('error', function(msg) {console.log("replace:build Fail Error: ", msg.toString());})
				.pipe( print() )
				.pipe(gulp.dest(sourceString + '.build/'));
});
// Replaces all of the (internally sourced) script tags in the player/creator files with
// a combined script tag referenceing a single player.js/creator.js source
gulp.task('replace-player-scripts', function()
{
	if(Embedding && Minifying)
	{
		gutil.log("Replace Player Scripts Running");
		return replaceScriptAssets("player");
	}
	return "";
});
gulp.task('replace-creator-scripts', function()
{
	if(Embedding && Minifying)
	{
		gutil.log("Replace Creator Scripts Running");
		return replaceScriptAssets("creator");
	}
	return "";
});
function replaceScriptAssets(htmlName)
{
	return gulp.src(sourceString + '.build/' + htmlName + '.html')
				.pipe( print() )
				.pipe(replace(/<script.*src=\"(?!assets\/vendor\/jsxgraphcore|assets\/vendor\/jquery.min.js|assets\/vendor\/mathquill-0.9.4\/mathquill.min.js|assets\/vendor\/angular.min.js)(.*)"(.*)>/g, function(toreplace)
				{
					if(toreplace.indexOf("//") != -1) return toreplace;
					if(toreplace.indexOf("materia.") != -1) return toreplace;
					if(toreplace.indexOf("data-embed='false'") != -1) return toreplace;
					if(toreplace.indexOf("data-embed=\"false\"") != -1) return toreplace;
					else return "";
				}))
				.pipe( print() )
				.pipe(replace(/<\/body>/g, function(toreplace)
				{
					return "<script src=\"" + htmlName + ".js\"></script></body>";
				}))
				.pipe( print() )
				.pipe(gulp.dest(sourceString + '.build/'));
}
// Replaces all of the (internally sourced) link tags in the player/creator files with
// a combined link tag referenceing a single player.css/creator.css source
gulp.task('replace-player-links', function()
{
	if(Embedding && Minifying)
	{
		gutil.log("Replace Player Links Running");
		return replaceLinkAssets("player");
	}
	return "";
});
gulp.task('replace-creator-links', function()
{
	if(Embedding && Minifying)
	{
		gutil.log("Replace Creator Links Running");
		return replaceLinkAssets("creator");
	}
	return "";
});
function replaceLinkAssets(htmlName)
{
	return gulp.src(sourceString + '.build/' + htmlName + '.html')
				.pipe( print() )
				.pipe(replace(/<link.*href=(\'|\")(.*)(\'|\")(.*)>/g, function(toreplace)
				{
					if(toreplace.indexOf("//") != -1) return toreplace;
					if(toreplace.indexOf("materia.") != -1) return toreplace;
					if(toreplace.indexOf("data-embed='false'") != -1) return toreplace;
					if(toreplace.indexOf("data-embed=\"false\"") != -1) return toreplace;
					else return "";
				}))
				.pipe( print() )
				.pipe(replace(/<\/head>/g, function(toreplace)
				{
					return "<link rel='stylesheet' type='text/css' href=\"" + htmlName + ".css\"></head>";
				}))
				.pipe( print() )
				.pipe(gulp.dest(sourceString + '.build/'));
}
// Replaces file path data based off of preset patterns.
gulp.task('replace:materiaJS', function()
{
	gutil.log("Replace Materia JS Running");
	return gulp.src([sourceString + '.build/*.html'])
				.pipe( print() )
				.pipe(replaceTask( { patterns: materiaJsReplacements } ))
				.on('error', function(msg) {console.log("replace:materiaJS Fail Error: ", msg.toString());})
				.pipe( print() )
				.pipe(gulp.dest(sourceString + '.build/'));
});
// Transpiles Sass into plain CSS.
gulp.task('sass', function()
{
	gutil.log("Sass Running");
	// Engine
	return gulp.src(sourceString + 'src/sass/*.scss')
				.pipe( sass().on('error', function(msg) {console.log("sass Fail Error: ", msg.toString());}) )
				.pipe( print() )
				.pipe( autoprefix().on('error', function(msg) {console.log("sass Fail Error: ", msg.toString());}) )
				.pipe( print() )
				.pipe(gulp.dest(sourceString + '.build/assets/css/'));
});
// Mangles code before end-user receives, to protect proprietary content.
gulp.task('uglify', function()
{
	return gulp.src([sourceString + '.build/*.js',
					sourceString + '.build/**/*.js',
					'!' + sourceString + '.build/*.min.js',
					'!' + sourceString + '.build/*.pack.js'])
				.pipe( uglify({ preserveComments: Minifying, compress: Minifying, mangle: Mangling }) )
				.on('error', function(msg) {console.log("uglify Fail Error: ", msg.toString());})
				.pipe( print() )
				.pipe(gulp.dest(sourceString + '.build/'));
});
gulp.task('default', function ()
{
	sourceString = "";

	console.log("EMBEDDING: ", Embedding);
	console.log("MINIFYING: ", Minifying);
	console.log("MANGLING: ", Mangling);

	runSequence(
		'clean:pre',
		'copy:init-assets',
		'copy:init-baseWidgetFiles',
		'copy:init-tests',
		'copy:init-templates',
		'copy:init-fonts',
		'copy:init-peg',
		'copy:init-export',
		'copy:init-icons',
		'copy:init-playdata',
		'copy:init-screenshots',
		'copy:init-score',
		'copy:init-spec',
		'peg',
		'coffee',
		'sass',
		'creator-js',
		'creator-min-js',
		'player-js',
		'player-min-js',
		'creator-css',
		'player-css',
		'player-controller-js',
		'build-player',
		'build-creator',
		'replace:materiaJS',
		'ngAnnotate',
		'cssmin',
		'minify-player-js',
		'minify-creator-js',
		'uglify',
		'minify-player-css',
		'minify-creator-css',
		'replace-player-scripts',
		'replace-creator-scripts',
		'replace-player-links',
		'replace-creator-links',
		'embed',
		'replace:build',
		'compress',
		'rename:ext',
		'clean:package'
	);
});
exports["gulp"] = function(widget, minify, mangle, embed, callback)
{
	widget = sanitize(widget);
	sourceString = 'sandbox/' + widget + '/';

	console.log("widget: ", widget, "\nEmbed: ", embed, "\nMangle: ", mangle, "\nMinify: ", minify);

	Embedding = (embed === "false") ? false : true;
	Mangling = (mangle === "false") ? false : true;
	Minifying = (minify === "false") ? false : true;

	// One of the ways to make sure Gulp does it's tasks in the order specified (Otherwise race condtions can occur).
	gulp.task('callback', function()
	{
		return callback(null, null, "");
	});

	runSequence(
		'clean:pre',
		'copy:init-assets',
		'copy:init-baseWidgetFiles',
		'copy:init-tests',
		'copy:init-templates',
		'copy:init-fonts',
		'copy:init-peg',
		'copy:init-export',
		'copy:init-icons',
		'copy:init-playdata',
		'copy:init-screenshots',
		'copy:init-score',
		'copy:init-spec',
		'peg',
		'coffee',
		'sass',
		'creator-js',
		'creator-min-js',
		'player-js',
		'player-min-js',
		'creator-css',
		'player-css',
		'player-controller-js',
		'build-player',
		'build-creator',
		'replace:materiaJS',
		'ngAnnotate',
		'cssmin',
		'minify-player-js',
		'minify-creator-js',
		'uglify',
		'minify-player-css',
		'minify-creator-css',
		'replace-player-scripts',
		'replace-creator-scripts',
		'replace-player-links',
		'replace-creator-links',
		'embed',
		'replace:build',
		'compress',
		'rename:ext',
		'clean:package',
		'callback'
	);
};

exports["install"] = function(callback)
{
	return fullExport(callback);
};

var fullExport = function(callback)
{
	var widgetPackagePostFix = Date.now();

	var totalCommand = "cd " + __dirname.slice(0, -widget.length) +
	" && find " + configs.materia_docker_location + "/app/fuel/app/tmp/widget_packages -name '" + widget + "*.wigt' -delete" +
	" && cd " + configs.materia_docker_location +
	" && cp " + __dirname.slice(0, -(widget.length+8)) + 'sandbox/' + widget + "/.build/_output/" + widget + ".wigt app/fuel/app/tmp/widget_packages/" + widget + "-" + widgetPackagePostFix + ".wigt" +
	" && eval $(docker-machine env " + configs.materia_docker_machine_name + ")" +
	" && ./install_widget.sh " + widget + "-" + widgetPackagePostFix + ".wigt";

	return exec(totalCommand, function(err, stdout, stderr)
	{
		//TODO: Convert to a match with new docker install responses.
		var match = stdout.match(/installed\:\ ([A-Za-z0-9\-]+)/);
		// If user doesn't edit their config.json file's materia-docker path properly to match their local machine, this will tell them, and how to fix it.
		var badFilePathError = new RegExp("find\:\ " + configs.materia_docker_location + "\/app\/fuel\/app\/tmp\/widget_packages", "g");
		var match2 = stderr.match(badFilePathError);
		// If user doesn't edit their config.json file's docker-machine name properly to match their local machine, this will tell them, and how to fix it.
		var invalidHostName = new RegExp("Host does not exist: \"" + configs.materia_docker_machine_name + "\"", "g");
		var match3 = stderr.match(invalidHostName);
		// Installed correctly?
		if (match && match[1])
		{
			gutil.log(match[1]);
			return callback(match[1]);
		}
		// Bad path in config.json.
		else if (match2 && match2[0])
		{
			gutil.log("Bad File Path in config.json (see README.txt, item \#2 -- bullet 3)");
			return callback("", "Bad File Path in config.json (see README.txt, item \#2 -- bullet 3)");
		}
		// Invalid docker-machine name in config.json.
		else if (match3 && match3[0])
		{
			gutil.log("Invalid Host Name in config.json (see README.txt, item \#2 -- bullet 5)");
			return callback("", "Invalid Host Name in config.json (see README.txt, item \#2 -- bullet 5)");
		}
		// Default to catch everything else that goes wrong.
		else
		{
			gutil.log(stdout + stderr);
			return callback("", stderr);
		}
	});
};

function sanitize(str)
{
	if (str) { return str.replace(/[^a-zA-Z0-9-_]/g, ''); }
	else { return ''; }
}
function showDocs()
{
	console.log("\nGulp helps you develop and package HTML widgets for the Materia Platform.\n" +
				"Place your development widget in static/widget/sandbox/myWidget\n\n" +
				"Required:\n" +
				"gulp --widget=widgetdir             Widget name (directory inside static/widget/sandbox/source).\n\n" +
				"Options:\n" +
				"--mangle=false                      Avoids mangle during uglification of js files. mangle=true by default" +
				"--minify=false                      Avoids minification (and embed by nature of minify). minify=true by default" +
				"--embed=false                       Avoids implanting the contents of js and css files into the html. embed=true by default" +
				"Example:\n" +
				"gulp --widget=widgetdir --mangle=false --embed=false");
}

// ---
// generated by coffee-script 1.9.2