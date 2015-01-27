var gulp = require('gulp');
var coffee = require('gulp-coffee');
var gutil = require('gulp-util');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var shell = require('gulp-shell');
var sass = require('gulp-sass');
var del = require('del');

gulp.task('peg', shell.task([
	'./node_modules/pegjs/bin/pegjs ./src/peg/latex.peg ./js/latex.js'
]));

gulp.task('coffee', function() {
	return gulp
		.src('./src/coffee/*.coffee')
		.pipe(coffee({bare: true}).on('error', gutil.log))
		.pipe(gulp.dest('./js/'))
});

gulp.task('sass', function() {
	return gulp
		.src('./src/sass/*.scss')
		.pipe(sass())
		.pipe(gulp.dest('./css/'));
});

gulp.task('creator-css', ['sass'], function() {
	return gulp
		.src(['./css/creator.css'])
		.pipe(concat('./creator.css'))
		.pipe(gulp.dest('./stylesheets/'));
});

gulp.task('player-css', ['sass'], function() {
	return gulp
		.src(['./css/player.css'])
		.pipe(concat('./player.css'))
		.pipe(gulp.dest('./stylesheets/'));
});

gulp.task('creator-js', ['coffee', 'peg'], function() {
	return gulp
		.src(['js/_bootstrap.js', 'js/latex.js', 'js/creator.js'])
		.pipe(concat('creator.js'))
		.pipe(gulp.dest('./scripts/'))
});

gulp.task('creator-min-js', ['creator-js'], function() {
	return gulp
		.src('./scripts/creator.js')
		.pipe(uglify())
		.pipe(concat('creator.min.js'))
		.pipe(gulp.dest('./scripts/'))
});

gulp.task('player-js', ['coffee', 'peg'], function() {
	return gulp
		.src(['js/_bootstrap.js', 'js/latex.js', 'js/player.js'])
		.pipe(concat('player.js'))
		.pipe(gulp.dest('./scripts/'))
});

gulp.task('player-min-js', ['player-js'], function() {
	return gulp
		.src('./scripts/player.js')
		.pipe(uglify())
		.pipe(concat('player.min.js'))
		.pipe(gulp.dest('./scripts/'))
});

gulp.task('default', ['watch']);

gulp.task('build', ['peg', 'coffee', 'sass', 'creator-js', 'creator-min-js', 'player-js', 'player-min-js', 'creator-css', 'player-css']);

gulp.task('watch', ['build'], function() {
	gulp.watch(['./src/**/*'], ['build']);
});