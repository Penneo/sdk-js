var dest = './dist';
var srcjs = './src/main.js';
var src = './examples';
var gutil = require('gulp-util');

module.exports = {
    server: {
        settings: {
            root: dest,
            host: 'localhost',
            port: 9000,
            protocol: 'http',
            livereload: {
                port: 35929
            }
        }
    },
    transpile: {
        src: './src/**/*.*',
        tasks: ['babel'],
        dest: './bin/'
    },
    browserify: {
        settings: {
            transform: ['babelify']
        },
        src: srcjs,
        expose: 'penneo-js-sdk',
        dest: dest + '/',
        outputName: 'bundle.js',
        debug: gutil.env.type === 'dev'
    },
    html: {
        src: src + '/**/**.**',
        dest: dest
    },
    watch: {
        src: 'src/**/*.*',
        tasks: ['reload']
    }
};
