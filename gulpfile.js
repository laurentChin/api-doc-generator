var gulp = require('gulp'),
    babel = require('gulp-babel'),
    eslint = require('gulp-eslint'),
    sass = require('gulp-sass'),
    plumber = require('gulp-plumber'),
    inject = require('gulp-inject'),
    runSequence = require('run-sequence');

gulp.task('js', function(){
    return gulp.src('./src/js/app.js')
        .pipe(plumber())
        .pipe(babel())
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(gulp.dest('./build/js/app.js'));
});

gulp.task('sass', function () {
    return gulp.src('./src/sass/**/*.scss')
        .pipe(plumber())
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./build/css/stylesheet.css'));
});