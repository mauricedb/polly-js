/**
 * Created by maurice on 9/17/2015.
 */

var gulp = require('gulp');
var mocha = require('gulp-mocha');

gulp.task('mocha', function () {
    return gulp.src('tests/**/*.js', {read: false})
        .pipe(mocha());
});

gulp.task('watch', function () {
    gulp.watch('**/*.js', ['mocha']);
});

gulp.task('default', ['mocha', 'watch']);