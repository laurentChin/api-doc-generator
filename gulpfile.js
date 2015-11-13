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

gulp.task('html', function(){
    var target = gulp.src('./src/html/index.html');
    var sources = gulp.src(
        [
            './build/js/app.js',
            './build/css/stylesheet.css'
        ],
        {read: false}
    );

    return target.pipe(inject(sources))
        .pipe(gulp.dest('./build'));
});

gulp.task('watch', function () {
    gulp.watch('./src/**/*.js', ['js']);
    gulp.watch('./src/**/*.scss', ['sass']);
    gulp.watch('./src/**/*.html', ['html']);
});