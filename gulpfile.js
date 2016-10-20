var gulp        				= require('gulp'),
		// gulp plugins
		sourcemaps         	= require('gulp-sourcemaps'),
    gutil              	= require('gulp-util'),
    changed             = require("gulp-changed"),
		postcss 						= require('gulp-postcss'),
    fileInclude         = require('gulp-file-include'),
    jshint              = require('gulp-jshint'),
    wrap                = require('gulp-wrap'),
    rename              = require('gulp-rename'),
    prettify            = require('gulp-prettify'),
    // browser control
    browserSync        = require('browser-sync'),
    // postcss library plugins
    autoprefixer       	= require('autoprefixer'),
    rucksack           	= require('rucksack-css'),
    // postcss plugins
    imageSet           	= require('postcss-image-set'),
    cssFocus            = require('postcss-focus'),
    precss              = require('precss'),
    cssShort            = require('postcss-short'),
    subpixels           = require('postcss-round-subpixels'),
    flexbugs            = require('postcss-flexbugs-fixes'),
    brands              = require('postcss-brand-colors'),
    vars                = require('postcss-simple-vars');

// load external variables for Magma library
var cssVariables = require('./variables.js');

// paths for src and dist
var paths = {
  cssSource: 'src/css/',
  cssDestination: 'dist/css/',
  htmlSource: 'src/html/',
  htmlDestination: 'dist/',
  imgSource: 'src/img/',
  imgDestination: 'dist/img/',
  jsSource: 'src/js/',
  jsDestination: 'dist/js/'
};

// gulp tasks

gulp.task('default', ['watch']);


// - build css for website
gulp.task('build-css', function() {
  return gulp.src(paths.cssSource + 'purchase-options.css')
    .pipe(changed(paths.cssDestination + '**/*.css'))
    .pipe(sourcemaps.init())
    .pipe(postcss([
      precss(),
      vars({
        variables: cssVariables
       }),
      cssShort(),
      cssFocus(),
      imageSet(),
      subpixels(),
      flexbugs(),
      rucksack({
      	colors: true
      }),
      brands(),
      autoprefixer()
    ]))
    .pipe(sourcemaps.write())
    .on("error", gutil.log)
    .pipe(gulp.dest(paths.cssDestination));
});

// - build index.html for website
gulp.task('build-index', function(){
  return gulp.src(paths.htmlSource + 'index.html')
    .pipe(changed(paths.htmlDestination + '**/*.html'))
    .pipe(fileInclude())
    .pipe(gulp.dest(paths.htmlDestination));
});

// - build layout for website
gulp.task('build-layout', function(){
  return gulp.src(paths.htmlSource + '**/layout-src.html')
    .pipe(changed(paths.htmlSource + '**/*.html'))
    .pipe(fileInclude())
    .pipe(rename('layout.html'))
    .pipe(prettify({indent_size: 2}))
    .pipe(gulp.dest(paths.htmlSource));
});

// - wrap content with layout
gulp.task('layout', function () {
  return gulp.src([paths.htmlSource + '/content/**/*.html', '!src/html/layout.html', '!src/html/layout-src.html', '!src/html/content/components/**/*.html'])
    .pipe(fileInclude())
    .pipe(wrap({src: 'src/html/layout.html'}))
    .pipe(prettify({indent_size: 2}))
    .pipe(gulp.dest(paths.htmlDestination));
});

// - pipe images for website
gulp.task('images', function(){
  return gulp.src(paths.imgSource + '**/*.{jpg,png,svg}')
    .pipe(changed(paths.imgDestination + '**/*.{jpg,png,svg}'))
    .pipe(gulp.dest(paths.imgDestination));
});

// - insert javascript quality checks
gulp.task('jshint', function() {
  return gulp.src(paths.jsSource + '**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(gulp.dest(paths.jsDestination));
});

// - sync watches and reload
gulp.task('sync-watch', ['build-index', 'build-css', 'build-layout', 'layout', 'images'], browserSync.reload)

// - watch directories
gulp.task('watch', function() {
	browserSync({
		server: {
			baseDir: "./dist/"
		}
	});
  gulp.watch(paths.cssSource + '**/*.css', ['sync-watch']);
  gulp.watch(paths.htmlSource + '**/*.html', ['sync-watch']);
  gulp.watch(paths.imgSource + '**/*.{jpg,png,svg}', ['sync-watch']);
  gulp.watch(paths.jsSource + '**/*.js', ['sync-watch']);
});
