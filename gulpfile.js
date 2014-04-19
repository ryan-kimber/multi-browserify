'use strict';

var express           = require('express'),
    app               = express(),
    browserify        = require('browserify'),
    distDir           = require('path').resolve('./build/dist'),
    expressPort       = 4000,
    expressRoot       = require('path').resolve('./build/express-tmp'),
    gulp              = require('gulp'),
    plugins           = require('gulp-load-plugins')(),
    rename            = require('gulp-rename'),
    runSequence       = require('run-sequence'),
    source            = require('vinyl-source-stream');

function startExpress() {
    app.use(express.static(expressRoot));
    app.listen(expressPort);
}

gulp.task('app', function(callback) {
    plugins.util.log('Rebuilding application JS bundle');

    var bundler = browserify({ entries: ['./js/demo-app.js'], fullPaths: false});
        bundler.external('angular');
        bundler.external('jquery');
    bundler.bundle({
         debug: true,
         external: ['angular', 'jquery']
    })
    .pipe(source('./js/demo-app.js'))
    .pipe(gulp.dest(expressRoot))
    .on('end', callback || function() {})
    .on('error', plugins.util.log);
});

gulp.task('dist', function(callback){
    plugins.util.log('Building our-ng-module.js...');
    var bundler = browserify({ entries: ['./src/our-ng-module.js'], fullPaths: false});
        bundler.external('angular');
        bundler.external('jquery');
        bundler.bundle({
            debug: true,
            external: ['angular', 'jquery']
        })
        .pipe(source('./src/our-ng-module.js'))
        .pipe(plugins.rename('our-ng-module.js'))
        .pipe(gulp.dest(distDir))
        .on('end', function(){
            plugins.util.log('Done building our-ng-module.js...');
            if(callback) callback();
        })
        .on('error', plugins.util.log);
});

gulp.task('vendor', function(callback){
    plugins.util.log('Building vendor-concat.js...');
    var bundler = browserify({ entries: ['./js/vendor-deps.js'], fullPaths: false});
    bundler.external('angular');
    bundler.external('bootstrap');
    bundler.external('jquery');
    bundler.external('jquery-ui');
    bundler.bundle({
            debug: true,
            external: ['angular', 'jquery']
        })
        .pipe(source('./js/vendor-deps.js'))
        .pipe(plugins.rename('./js/vendor-concat.js'))
        .pipe(gulp.dest(expressRoot))
        .on('error', plugins.util.log)
        .on('end', function(){
            plugins.util.log('Done building vendor-concat.js...');
            var cb = callback || function() {};
            cb();
        });
});

gulp.task('clean', function(callback) {
    plugins.util.log('Cleaning out dist and express root...');
    gulp.src([expressRoot, distDir], {read: false})
        .pipe(plugins.rimraf({force: true}))
        .on('error', plugins.util.log)
        .on('end', callback || function() {});
});

gulp.task('copyIndex', function(callback) {
    var gulpPipe = gulp.src('./index.html')
        .pipe(gulp.dest(expressRoot))
        .on('end', callback || function(){ plugins.util.log("Index.html copied to expressRoot..."); })
        .on('error', plugins.util.log);
});

gulp.task('default', function () {
    startExpress();
    runSequence('clean', 'copyIndex', 'vendor', 'dist', 'app');
});