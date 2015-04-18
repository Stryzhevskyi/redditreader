/**
 * Created by Sergei on 14.04.15.
 */
var gulp = require('gulp');
var concat = require('gulp-concat');
var insert = require('gulp-insert');
var copy = require('gulp-copy');
var rename = require('gulp-rename');
var watch = require('gulp-watch');
var stripDebug = require('gulp-strip-debug');
var html2tpl = require('gulp-html2tpl');
var rjs = require('gulp-requirejs');
var uglify = require('gulp-uglify');
var webserver = require('gulp-webserver');
var changed = require('gulp-changed');


gulp.task('js', function () {
    return gulp
        .src(['src/js/**/*.js'])
        .pipe(changed('dist/js/'))
        .pipe(copy('dist/js/', {prefix: 2}));
});

gulp.task('libs', ['libs_css']);

gulp.task('libs_css', function () {
    return gulp
        .src([
            'src/css/lib/*.css',
            'bower_components/bootstrap/dist/css/bootstrap.min.css',
            //'bower_components/bootstrap/dist/css/bootstrap-theme.min.css',
            //'bower_components/bootstrap-material-design/dist/css/material.min.css',
            'bower_components/bootstrap-material-design/dist/css/roboto.min.css',
            'bower_components/bootstrap-material-design/dist/css/material-fullpalette.min.css',
            'bower_components/bootstrap-material-design/dist/css/ripples.min.css'
        ])
        .pipe(concat('libs.css'))
        .pipe(gulp.dest('dist/css/'));
});


gulp.task('templates', function () {
    gulp.src('src/templates/*.ejs')
        .pipe(html2tpl(
            'templates.js',
            {varName: '$$'},
            {
                evaluate: /\{\{(.+?)\}\}/g,
                interpolate: /\{\{=(.+?)\}\}/g,
                escape: /\{\{-(.+?)\}\}/g,
                variable: 'o'
            }
        ))
        .pipe(gulp.dest('dist/js'));
});

gulp.task('index', function () {
    return gulp.src(['src/*'])
        .pipe(changed('dist/'))
        .pipe(rename(function(){}))
        .pipe(gulp.dest('dist/'));
});

gulp.task('styles', function () {
    return gulp
        .src([
            'src/css/style.css',
            'src/css/media.css'
        ])
        .pipe(concat('app.css'))
        .pipe(gulp.dest('dist/css/'));
});

gulp.task('fonts', function () {
    return gulp
        .src([
            'bower_components/bootstrap/fonts/*',
            'bower_components/bootstrap-material-design/dist/fonts/*'
        ])
        .pipe(rename(function (path) {}))
        .pipe(gulp.dest('dist/fonts/'));
});

gulp.task('watch', function () {
    watch('src/templates/*', function () {
        gulp.start('templates');
    });

    watch('src/*', function () {
        gulp.start('index');
    });

    watch('src/css/**/*.css', function () {
        gulp.start(['styles', 'libs_css']);
    });

    watch([
        'src/**/*.js',
        '!src/libs/**',
        '!src/templates/**'
    ], function () {
        gulp.start(['js']);
    });

    watch('src/libs/**', function () {
        gulp.start(['libs']);
    });
});

gulp.task('rbuild', function () {
    rjs({
        baseUrl: 'dist/js/',
        mainConfigFile: 'dist/js/require.config.js',
        findNestedDependencies: true,
        out: 'build.js',
        name: 'loader'
    })
        .pipe(gulp.dest('./dist/'))
        .pipe(stripDebug())
        .pipe(gulp.dest('./dist/'))
        .pipe(uglify())
        .pipe(gulp.dest('./dist/min'));
});


gulp.task('cssmin', function () {
    return gulp.src(['dist/css/libs.css', 'dist/css/app.css'])
        .pipe(concat('build.css'))
        .pipe(minifyCSS({
            advanced: false,
            aggressiveMerging: false,
            keepSpecialComments: 0
        }))
        .pipe(gulp.dest('dist/min'))
});


gulp.task('server', function () {
    gulp.src('./')
        .pipe(webserver({
            livereload: true,
            directoryListing: false,
            open: 'http://127.0.0.1:8000/dist/',
            directoryListing : 'dist/'
            //https: {
            //    key: './private/server.key',
            //    cert: './private/server.crt'
            //}
        }));
});


gulp.task('dist', ['rbuild', 'cssmin']);

gulp.task('build', ['js', 'index', 'styles', 'templates', 'libs', 'fonts']);

gulp.task('default', [
    'build',
    'watch'
]);
