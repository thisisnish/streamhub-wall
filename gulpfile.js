var gulp = require('gulp');
var less = require('gulp-less');
var nodemon = require('gulp-nodemon');
var packageJson = require('./package.json');
var rework = require('gulp-rework');
var prefixSelectors = require('rework/lib/plugins/prefix-selectors');
var util = require('gulp-util');

function lessify(path, dest) {
  dest = dest || 'dev';
  var appName = packageJson.name;
  var version = packageJson.version;
  gulp.src(path)
    .pipe(less({paths: [__dirname]}).on('error', util.log))
    .pipe(rework(prefixSelectors('[data-lf-package="' + appName + '#' + version + '"]')))
    .pipe(gulp.dest(dest));
}

gulp.task('default', function () {

  /**
   * Run the server
   */
  nodemon({script: 'node_modules/http-server/bin/http-server'});

  /**
   * Watch for less file changes.
   */
  gulp.watch('src/**/*.less', function (event) {
    console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    lessify(event.path);
  });

  // Lessify the style less
  lessify(__dirname + '/src/styles/wall-component.less');
});

/**
 * Prefix all selectors in the CSS file with the app version.
 */
gulp.task('prefix', function () {
  lessify(__dirname + '/src/styles/wall-component.less', 'dist/temp');
});
