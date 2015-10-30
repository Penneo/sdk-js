var gulp = require('gulp');
var open = require('gulp-open');
var config = require('../config').server.settings;

gulp.task('open', function() {
    var options = {
        uri: config.protocol + '://' + config.host + ':' + config.port,
        app: ''
    };
    gulp.src(__filename)
    .pipe(open(options));
});
