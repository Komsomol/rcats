"use strict";

var gulp 		    = require('gulp');
var maps 	      = require('gulp-sourcemaps');
var minifyCss 	= require('gulp-minify-css');
var concat 		  = require('gulp-concat');
var uglify 		  = require('gulp-uglify');
var del         = require('del');
var rename      = require('gulp-rename');
var concatCss   = require('gulp-concat-css');

gulp.task('test', function(){
	console.log('This is simply a test');
})

gulp.task('concatScripts', function() {
   return	gulp.src([
  		'js/vendor/jquery-1.11.0.min.js', 
  		'js/vendor/bootstrap.min.js', 
  		'js/vendor/imagesloaded.pkgd.js', 
  		'js/vendor/isotope.pkgd.js',
  		'js/main.js', ])
    .pipe(maps.init())
    .pipe(concat('all.js'))
    .pipe(maps.write('./'))
    .pipe(gulp.dest('js'));
});

gulp.task("minifyScripts", ["concatScripts"], function() {
  return gulp.src("js/all.js")
    .pipe(uglify())
    .pipe(rename('all.min.js'))
    .pipe(gulp.dest('js'));
});

gulp.task('watchFiles', function() {
  gulp.watch('js/main.js', ['minifyScripts']);
});

gulp.task('clean', function() {
  del(['build']);
});

gulp.task("build", ['minifyScripts'], function() {
  return gulp.src([
    'index.html', 
    'rcats.ico', 
    'css/**', 
    'js/all.min.js',
    'img/**', 
    'fonts/**'], { base: './'})
            .pipe(gulp.dest('build'));
});

gulp.task('serve', ['watchFiles']);

gulp.task("default", ["clean"], function() {
  gulp.start('build');
});