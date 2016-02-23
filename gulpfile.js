var gulp = require('gulp');
    uglify = require('gulp-uglify');
    browserSync = require('browser-sync').create();
    plumber = require('gulp-plumber');
    notify = require('gulp-notify');
    jscs = require('gulp-jscs');
    sass = require('gulp-sass');
    autoprefixer = require('gulp-autoprefixer');
    minifyCSS = require('gulp-minify-css');
    rename = require('gulp-rename');

gulp.task('sass', function(){
  gulp.src('./sass/style.scss')
    .pipe(sass())
    .pipe(autoprefixer({
      browsers: ['last 2 versions']
    }))
    .pipe(gulp.dest('./build/css'))
    .pipe(minifyCSS())
    .pipe(rename('style.min.css'))
    .pipe(gulp.dest('./build/css'));
    });

gulp.task('uglify', function(){
  gulp.src('./js/main.js') // What files do we want gulp to consume?
    .pipe(plumber())
    .pipe(jscs())
    .pipe(jscs.reporter())
    .pipe(uglify()) // Call the uglify function on these files
    .pipe(gulp.dest('./build')); // Where do we put the result?
});

gulp.task('watch', function(){
  browserSync.init({
    server: {
      baseDir: './'
    }
  });

  gulp.watch(['./js/main.js'], ['uglify']);
  gulp.watch(['./sass/*.scss'], ['sass']);
  gulp.watch(['./build/main.js', './build/css/style.css', 'index.html']).on('change', browserSync.reload);

});

gulp.task('default', ['watch', 'uglify', 'sass']);
