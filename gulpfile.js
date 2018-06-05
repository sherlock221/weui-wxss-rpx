var gulp = require('gulp');
var less = require('gulp-less');
var rename = require('gulp-rename');
var postcss = require('gulp-postcss');
var cssnano = require('gulp-cssnano');
var header = require('gulp-header');
var autoprefixer = require('autoprefixer');
var replace = require('gulp-replace');
var pkg = require('./package.json');


gulp.task('watch', function() {
  gulp.watch('src/**', ['build:style', 'build:example']);
});
gulp.task('build:style', function() {
  var banner = [
    '/*!',
    ' * WeUI v<%= pkg.version %> (<%= pkg.homepage %>)',
    ' * Copyright <%= new Date().getFullYear() %> Tencent, Inc.',
    ' * Licensed under the <%= pkg.license %> license',
    ' */',
    ''
  ].join('\n');
  gulp
    .src(['src/style/**/*.wxss', 'src/example/*.wxss'], { base: 'src' })
    .pipe(less())
    .pipe(postcss([autoprefixer(['iOS >= 8', 'Android >= 4.1'])]))
    // .pipe(
    //   cssnano({
    //     zindex: false,
    //     autoprefixer: false,
    //     discardComments: { removeAll: true }
    //   })
    // )
    .pipe(header(banner, { pkg: pkg }))
    .pipe(
      rename(function(path) {
        path.extname = '.wxss';
      })
    )
    .pipe(gulp.dest('dist'));
});

gulp.task('pxToRpx', function(){
    return gulp.src('./dist/style/weui.wxss')
        .pipe(replace(/(\d+)px/g, function(match, p1){
            return Number(p1) * 2+ 'rpx';
        }))
        .pipe(
            rename(function(path) {
                path.extname = '.rpx.wxss';
            })
        )
        .pipe(gulp.dest('dist/style'));
});

gulp.task('build:example', function() {
  gulp
    .src(
      [
        'src/app.js',
        'src/app.json',
        'src/app.wxss',
        'src/example/**',
        '!src/example/*.wxss'
      ],
      { base: 'src' }
    )
    .pipe(gulp.dest('dist'));
});

gulp.task('default', ['watch', 'build:style', 'build:example']);
