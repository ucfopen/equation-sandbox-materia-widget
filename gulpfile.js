var gulp = require('gulp');
var coffee = require('gulp-coffee');
var gutil = require('gulp-util');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var shell = require('gulp-shell');
var sass = require('gulp-sass');
var del = require('del');

gulp.task('peg', shell.task([
	// -e option sets the exported variable from modules.exports to window.latexParser
	// --cache option turns on memoization, without it expressions like "\sin()" can
	// hang the browser really bad (see https://github.com/pegjs/pegjs/issues/205)
	'./node_modules/pegjs/bin/pegjs -e window.latexParser --cache ./gulp_this/src/peg/latex.peg ./assets/js/latex.js'
]));

gulp.task('coffee', function() {
	return gulp
		.src('./gulp_this/src/coffee/*.coffee')
		.pipe(coffee({bare: true}).on('error', gutil.log))
		.pipe(gulp.dest('./assets/js/'))
});

gulp.task('sass', function() {
	return gulp
		.src('./gulp_this/src/sass/*.scss')
		.pipe(sass())
		.pipe(gulp.dest('./assets/css/'));
});

gulp.task('creator-css', ['sass'], function() {
	return gulp
		.src(['./gulp_this/css/creator.css'])
		.pipe(concat('./creator.css'))
		.pipe(gulp.dest('./assets/stylesheets/'));
});

gulp.task('player-css', ['sass'], function() {
	return gulp
		.src(['./gulp_this/css/player.css'])
		.pipe(concat('./player.css'))
		.pipe(gulp.dest('./assets/stylesheets/'));
});

gulp.task('creator-js', ['coffee', 'peg'], function() {
	return gulp
		.src(['./gulp_this/js/_bootstrap.js', 'gulp_this/js/latex.js', 'gulp_this/js/creator.js'])
		.pipe(concat('creator.js'))
		.pipe(gulp.dest('./assets/scripts/'))
});

gulp.task('creator-min-js', ['creator-js'], function() {
	return gulp
		.src('./gulp_this/scripts/creator.js')
		.pipe(uglify())
		.pipe(concat('creator.min.js'))
		.pipe(gulp.dest('./assets/scripts/'))
});

gulp.task('player-js', ['coffee', 'peg'], function() {
	return gulp
		.src(['./js/_bootstrap.js', 'gulp_this/js/latex.js', 'gulp_this/js/player.js'])
		.pipe(concat('player.js'))
		.pipe(gulp.dest('./assets/scripts/'))
});

gulp.task('player-min-js', ['player-js'], function() {
	return gulp
		.src('./gulp_this/scripts/player.js')
		.pipe(uglify())
		.pipe(concat('player.min.js'))
		.pipe(gulp.dest('./assets/scripts/'))
});

gulp.task('default', ['build']);

gulp.task('build', ['peg', 'coffee', 'sass', 'creator-js', 'creator-min-js', 'player-js', 'player-min-js', 'creator-css', 'player-css']);

gulp.task('watch', ['build'], function() {
	gulp.watch(['./src/**/*'], ['build']);
});