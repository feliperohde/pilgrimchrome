'use strict';

import path from 'path';
import gulpif from 'gulp-if';
import multiglob from "multi-glob";

let glob = multiglob.glob;


export default function(gulp, plugins, args, config, taskTarget, browserSync) {

  // contact
  let dirs = config.directories;
  let entries = config.entries;
  let dest = path.join(taskTarget, 'css/');

  let stylusCompileTask = (file, isLast) => {

    gulp.src(file)
    .pipe(plugins.plumber())
    .pipe(plugins.stylus({
      compress: (args.compress) ?  true : false,
      disableCache: true,
      paths:  ['node_modules', './source/_styles'],
      import: ['core/base'],
      'include css': true
    }))
    .pipe(plugins.rename(function(path) {
        // Remove 'source' directory as well as prefixed folder underscores
        // Ex: 'src/_styles' --> '/styles'
        path.dirname = path.dirname.replace(dirs.source, '').replace('_', '');
      }))
    .pipe(gulpif(args.production, plugins.cssnano({rebase: false})))
    .pipe(gulp.dest(dest));
  };

  // Stylus compilation
  gulp.task('stylus', () => {

    return glob(path.join(dirs.source, dirs.styles, entries.css), function (er, files) {
    // files is an array of filenames.
    // If the `nonull` option is set, and nothing
    // was found, then files is ["**/*.js"]
    // er is an error object or null.

      if (er) {
        //done(er);
      }

      for (var i = files.length - 1; i >= 0; i--) {
        //gutil.log(path.resolve(files[i]));
        stylusCompileTask(files[i], null);
      }

    });

  });
}
