let gulp = require('gulp');
let sass = require('gulp-sass');
let sourcemaps = require('gulp-sourcemaps');

let dest = [
    './assets/sass/*.scss',
    './blueprint3d/example/sass/*.scss',
];

let src = [
    './node_modules/bootstrap-sass/assets/stylesheets',
    // './node_modules/sweetalert2/src',
    // './node_modules/font-awesome/scss'
];

gulp.task('styles', function () {
    gulp.src(dest)
        .pipe(sourcemaps.init())
        .pipe(sass({
            includePaths: src
        }).on('error', sass.logError))
        .pipe(sourcemaps.write(function (file) {
            console.log('map', file.path);
            return file.base + '../css/';
        }))
        .pipe(gulp.dest(function (file) {
            console.log(file.path);
            return file.base + '../css/';
        }));
});

gulp.task('build', function () {
    gulp.src(dest)
        .pipe(sass({
            includePaths: src,
            outputStyle: 'compressed'
        }).on('error', sass.logError))
        .pipe(gulp.dest(function (file) {
            console.log(file.path);
            return file.base + '../css/';
        }));
});

gulp.task('watch', function () {
    gulp.watch(dest, ['styles']);

});

gulp.task('default', ['styles', 'watch']);