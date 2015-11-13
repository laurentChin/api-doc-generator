var gulp = require('gulp'),
    babel = require('gulp-babel'),
    eslint = require('gulp-eslint'),
    sass = require('gulp-sass'),
    plumber = require('gulp-plumber'),
    inject = require('gulp-inject'),
    runSequence = require('run-sequence'),
    fs = require('fs'),
    util = require('gulp-util'),
    prompt = require('gulp-prompt'),
    jsonfile = require('jsonfile'),
    apiDescription;

gulp.task('default', function(done){
    "use strict";
    runSequence(
        'build',
        'watch',
        done
    );
});

gulp.task('build', function(done){
    "use strict";
    runSequence(
        'check-description-file',
        'read-description-file',
        ['js', 'sass'],
        'html',
        done
    );
});

gulp.task('check-description-file', function(done){
    "use strict";
    var title, description,
        descriptionFile = './api.description.json',
        templateFile = './api.description.json.dist';

    // look for api.description.js
    if(!fs.existsSync(descriptionFile)) {
        // the file does not exist create it by copying the template one
        util.log(util.colors.cyan("api.description.js"), "does not exist creating a new one based on default template");
        gulp.src(templateFile)
            .pipe(plumber())
            .pipe(prompt.prompt([
                {
                    'type': 'input',
                    'name': 'title',
                    'message' : 'Please give a title for your documentation'
                },
                {
                    'type': 'input',
                    'name': 'description',
                    'default': '',
                    'message' : 'Please give a description for your documentation'
                }
            ], function(result){
                var templateData = jsonfile.readFileSync(templateFile, 'utf8');
                // upate title and description with user inputs
                templateData.title = result.title;
                templateData.description = result.description;

                jsonfile.writeFileSync(
                    descriptionFile,
                    templateData,
                    {
                        spaces: 2
                    }
                );

                done();
            }));
    } else {
        done();
    }
});

gulp.task('read-description-file', function(){
    "use strict";
    apiDescription = jsonfile.readFileSync('./api.description.json');
});

gulp.task('js', function(){
    "use strict";
    return gulp.src('./src/js/app.js')
        .pipe(plumber())
        .pipe(babel())
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(gulp.dest('./build/js/app.js'));
});

gulp.task('sass', function () {
    "use strict";
    return gulp.src('./src/sass/**/*.scss')
        .pipe(plumber())
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./build/css/stylesheet.css'));
});

gulp.task('html', function(){
    "use strict";
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
    "use strict";
    gulp.watch('./src/**/*.js', ['js']);
    gulp.watch('./src/**/*.scss', ['sass']);
    gulp.watch('./src/**/*.html', ['html']);
});