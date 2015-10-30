var gulp = require('gulp');
var config = require('../config').transpile;

gulp.task('live-transpile', function() {
    gulp.watch(config.src, config.tasks);
});
