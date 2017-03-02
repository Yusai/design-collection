var gulp = require('gulp');
var less = require('gulp-less');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

var webserver = require('gulp-webserver');

gulp.task('less', function() {
    return gulp.src('./dev/less/style.less')
        .pipe(less())
        .pipe(gulp.dest('./dist/'));
});

gulp.task('js', function() {
    return gulp.src('./dev/js/*.js')
        .pipe(concat('design-collection.js'))
        // .pipe(gulp.dest('./js/'))
        // .pipe(uglify())
        .pipe(gulp.dest('./dist/'));
});

gulp.task('watch-less', function() {
    return gulp.watch('./dev/less/*.less', ['less']);
});

gulp.task('watch-js', function() {
    return gulp.watch('./dev/js/*.js', ['js']);
});

gulp.task('watch', ['watch-less', 'watch-js']);

gulp.task('webserver', function() {
    gulp.src('./')
        .pipe(webserver({
            livereload: true
        }));
});

gulp.task('default', ['webserver', 'watch']);