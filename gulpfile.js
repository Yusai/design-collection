var gulp = require('gulp');
var less = require('gulp-less');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var ts = require('gulp-typescript');
var tsProject = ts.createProject('tsconfig.json');

var webserver = require('gulp-webserver');

//
function concat_js() {
    return gulp.src(['./dev/tmp/*.js'])
        .pipe(concat('design-collection.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./dist/'));
}
//TypeScript
gulp.task('ts', ['ts-compile'], function() {
    return concat_js();
});
//
gulp.task('ts-compile', function() {
    return tsProject.src()
        .pipe(tsProject())
        .js.pipe(gulp.dest('./dev/tmp'));
});
//
gulp.task('watch-ts', function() {
    return gulp.watch('./dev/ts/*.ts', ['ts']);
});

//less
gulp.task('less', function() {
    return gulp.src('./dev/less/style.less')
        .pipe(less())
        .pipe(gulp.dest('./dist/'));
});
gulp.task('watch-less', function() {
    return gulp.watch('./dev/less/*.less', ['less']);
});
//
gulp.task('watch', ['watch-less', 'watch-ts']);
//
gulp.task('webserver', function() {
    gulp.src('./')
        .pipe(webserver({
            livereload: {
                enable: true,
                filter: (fileName) => {
                    return !fileName.match(/.ts$/);
                }
            }
        }));
});
//
gulp.task('default', ['webserver', 'watch']);
