var gulp = require ('gulp');
var concat = require ('gulp-concat');
var sourcemaps =  require('gulp-sourcemaps'); // for better debugging in clinet side JS
var uglify = require('gulp-uglify');
var ngAnnotate =  require('gulp-ng-annotate');
var nodemon = require('gulp-nodemon');
var trim = require('gulp-trim');
const minify = require('gulp-minify');

gulp.task('server', function(){
	nodemon({
		script: 'server.js',
		ext: 'js'
	})	
  gulp.src(['ng/module.js','ng/*.js'])
	.pipe(sourcemaps.init())
    .pipe(concat('app.js'))
	.pipe(ngAnnotate()) // This allows you to write the code in the concise manner and solves the minification problem
	//.pipe(uglify()) // this is for uglifying JS files (this is usefull for last build)
	.pipe(trim())
	.pipe(minify())// generate app.min.js iin the same folder
    .pipe(gulp.dest('www/js'));  
});