"use strict";

var gulp 		    = require('gulp');
var maps 	      = require('gulp-sourcemaps');
var minifyCss 	= require('gulp-minify-css');
var concat 		  = require('gulp-concat');
var uglify 		  = require('gulp-uglify');
var del         = require('del');
var rename = require('gulp-rename');

gulp.task('test', function(){
	console.log('This is simply a test');
})

gulp.task('concatScripts', function() {
   return	gulp.src([
  		'js/vendor/modernizr-2.6.2-respond-1.1.0.min.js', 
  		'js/vendor/jquery-1.11.0.min.js', 
  		'js/vendor/bootstrap.min.js', 
  		'js/vendor/imagesloaded.pkgd.js', 
  		'js/vendor/isotope.pkgd.js',
  		'js/main.js', ])
    .pipe(maps.init())
    .pipe(concat('all.js'))
    .pipe(maps.write('./'))
    .pipe(gulp.dest('dist'));
});

gulp.task("minifyScripts", ["concatScripts"], function() {
  return gulp.src("js/app.js")
    .pipe(uglify())
    .pipe(rename('app.min.js'))
    .pipe(gulp.dest('js'));
});

gulp.task('watchFiles', function() {
  gulp.watch('js/main.js', ['concatScripts']);
})

gulp.task('clean', function() {
  del(['dist', 'css/application.css*', 'js/app*.js*']);
});

gulp.task("build", ['minifyScripts'], function() {
  return gulp.src(["css/application.css", "js/app.min.js", 'index.html',
                   "img/**", "fonts/**"], { base: './'})
            .pipe(gulp.dest('dist'));
});

gulp.task('serve', ['watchFiles']);

gulp.task("default", ["clean"], function() {
  gulp.start('build');
});