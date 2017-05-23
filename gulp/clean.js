'use strict';

import path from 'path';
import del from 'del';

export default function(gulp, plugins, args, config, taskTarget, browserSync) {
  let dirs = config.directories;

  // Clean build css
  gulp.task('clean', del.bind({force: true}, null, [
    path.join(dirs.temporary + '/css/')
  ]));
}
