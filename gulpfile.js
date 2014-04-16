'use strict';

var connectLr         = require('connect-livereload'),
    express           = require('express'),
    app               = express(),
    browserify        = require('browserify'),
    debug             = require('gulp-debug'),
    distDir           = require('path').resolve('./build/dist'),
    expressPort       = 4000,
    expressRoot       = require('path').resolve('./build/.tmp'),
    gulp              = require('gulp'),
    liveReloadPort    = 35729,
    lrServer          = require('tiny-lr')(),
    permitIndexReload = true,
    plugins           = require('gulp-load-plugins')(),
    publicDir         = require('path').resolve('./build/demo'),
    rename            = require('gulp-rename'),
    source            = require('vinyl-source-stream'),
    streamify         = require('gulp-streamify'),
    watchify          = require('watchify');

function startExpress() {
    app.use(connectLr());
    app.use(express.static(expressRoot));
    app.listen(expressPort);
}

function startLiveReload() {
    lrServer.listen(liveReloadPort, function(err) {
        if (err) {
            return console.log(err);
        }
    });
}

function notifyLivereload(fileName) {
    if (fileName !== 'gulp.html' || permitIndexReload) {
        lrServer.changed({ body: { files: [fileName] } });

        if (fileName === 'gulp.html') {
            permitIndexReload = false;
            setTimeout(function() { permitIndexReload = true; }, 5000);
        }
    }
}

function clean(relativePath, callback) {
    plugins.util.log('Cleaning: ' + plugins.util.colors.blue(relativePath));

    gulp
        .src([(publicDir + relativePath), (expressRoot + relativePath), (distDir + relativePath)], {read: false})
        .pipe(plugins.rimraf({force: true}))
        .on('end', callback || function() {});
}

function buildDemoAppScript(callback) {
    var bundler = watchify('./js/gulpapp.js');

    function rebundle() {
        clean('/js/gulpapp*.js', function() {
            plugins.util.log('Rebuilding application JS bundle');

            var bundler = browserify({ entries: ['./js/gulpapp.js'], fullPaths: false});
                bundler.external('angular');
                bundler.external('angular-bootstrap');
                bundler.external('angular-route');
                bundler.external('angular-sanitize');
                bundler.external('jquery');
                plugins.util.log("About to call bundle()...");
            bundler.bundle({
                 debug: true,
                 external: ['angular', 'jquery']
            })
            .pipe(source('./js/gulpapp.js'))
            .pipe(plugins.streamify(debug({verbose: true})))
            .pipe(gulp.dest(expressRoot))
            //.pipe(plugins.streamify(plugins.uglify({ mangle: false })))
            .pipe(plugins.streamify(plugins.rev()))
            .pipe(plugins.streamify(plugins.size({ showFiles: true })))
            .pipe(gulp.dest(publicDir))
            .on('end', callback || function() {})
            .on('error', plugins.util.log);
        });
    }

    bundler.on('update', rebundle);
    bundler.on('error', plugins.util.log);
    rebundle();
}

function buildDistributableScript(callback){
    plugins.util.log('Building test-ng-module.js...');

    gulp.src(["./src/test-ng-module.js"])
        .pipe(browserify({
            external: [
                'angular',
                'angular-bootstrap',
                'angular-route',
                'angular-santize',
                'jquery'
            ]
        }))
        .pipe(gulp.dest(distDir))
        .pipe(plugins.streamify(plugins.size({ showFiles: true })))
        .pipe(plugins.streamify(plugins.uglify({ mangle: false })))
        .pipe(rename('think-forms-components.min.js'))
        .pipe(plugins.streamify(plugins.size({ showFiles: true })))
        .pipe(gulp.dest(distDir));

    plugins.util.log('Done building think-forms-components.js...');
};

function buildVendorScript(callback){
    plugins.util.log('Building gulpvendor.js...');

    clean('/js/gulpvendor*.js', function() {
        var bundler = browserify({ entries: ['./js/gulpvendor.js'], fullPaths: false});
        bundler.external('angular');
        bundler.external('bootstrap');
        bundler.external('jquery');
        bundler.external('jquery-ui');
        plugins.util.log("About to call bundle()...");
        bundler.bundle({
                debug: true,
                external: ['angular', 'jquery']
            })
            .pipe(source('./js/gulpvendor.js'))
            .pipe(plugins.streamify(debug({verbose: true})))
            .pipe(gulp.dest(expressRoot))
            .pipe(streamify(plugins.size({ showFiles: true })))
            .pipe(streamify(plugins.uglify({ mangle: false })))
            .pipe(streamify(plugins.rev()))
            .pipe(streamify(plugins.size({ showFiles: true })))
            .pipe(gulp.dest(publicDir))
            .on('error', plugins.util.log)
            .on('end', function(){ plugins.util.log('Done building gulpvendor.js...'); });
    });
};

function buildIndexHtml(callback){
    plugins.util.log('Rebuilding gulp.html');

    function inject(glob, path, tag) {
        return plugins.inject(
            gulp.src(glob, {
                cwd: path
            }), {
                starttag: '<!-- gulp-inject:' + tag + ':{{ext}} -->'
            }
        );
    }

    function buildIndex(path, cb) {
        gulp.src('gulp.html')
            .pipe(inject('./js/gulpvendor*.js', path, 'vendorjs'))
            .pipe(inject('./js/gulpapp*.js', path, 'appjs'))
            .pipe(gulp.dest(path))
            .on('end', cb || function() {})
            .on('error', plugins.util.log);
    }

    buildIndex(expressRoot, callback || function(){});
    buildIndex(publicDir, function(){});
    //Not building for dist since we only need js and css in that directory
}

gulp.task('default', function () {
    clean('/', function() {
        plugins.util.log("Starting Express...");
        startExpress();
        plugins.util.log("Starting LiveReload...");
        startLiveReload();
        plugins.util.log("Calling buildDemoAppScript...");

        buildVendorScript();
        buildDemoAppScript(function() {
            buildIndexHtml(function() {
                notifyLivereload('gulp.html');
            });
        });
        plugins.util.log("Setting up watches...");
        gulp.watch('gulp.html', function() {
            buildIndexHtml(function() {
                notifyLivereload('gulp.html');
            });
        });
    });
});

gulp.task('dist', function(){
    buildDistributableScript();
});

gulp.task('vendor', function(){
    buildVendorScript();
});