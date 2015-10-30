var gulp = require('gulp');
var babel = require('gulp-babel');
var config = require('../config').transpile;

gulp.task('babel', function() {
    gulp.src(config.src)
    .pipe(babel({
        presets: ['babel-preset-es2015']
    }))
    .pipe(gulp.dest(config.dest));
});
