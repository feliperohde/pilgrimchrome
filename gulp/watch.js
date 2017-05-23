'use strict';

import path from 'path';

export default function(gulp, plugins, args, config, taskTarget, browserSync) {
  let dirs = config.directories;

  // Watch task
  gulp.task('watch', () => {

    if (!args.production) {
      gulp.watch([
        path.join(dirs.source, dirs.styles, '**/*.styl'),
        path.join(dirs.source, dirs.components, '**/*.styl'),
        path.join(dirs.source, dirs.modules, '**/*.styl'),
        path.join(dirs.source, dirs.organisms, '**/*.styl'),
        path.join(dirs.source, dirs.templates, '**/*.styl'),
        path.join(dirs.source, dirs.pages, '**/*.styl'),
      ], ['stylus']);

      // Images
      gulp.watch([
        path.join(dirs.source, dirs.images, '**/*.{jpg,jpeg,gif,svg,png}')
      ], ['imagemin']);

      // All other files
      gulp.watch([
        path.join(dirs.temporary, 'css/*.{css,js}'),
        path.join(dirs.temporary, 'scripts/*.{css,js}'),
        path.join(dirs.temporary, 'templates/*.{twig,html}')
      ]);
    }
  });
}
