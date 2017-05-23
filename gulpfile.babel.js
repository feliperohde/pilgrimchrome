'use strict';

import gulp from 'gulp';
import path from 'path';
import gulpLoadPlugins from 'gulp-load-plugins';
import pjson from './package.json';
import minimist from 'minimist';
import wrench from 'wrench';

// Load all gulp plugins based on their names
// EX: gulp-copy -> copy
const plugins = gulpLoadPlugins();
// Create karma server
// const KarmaServer = require('karma').Server;

let config = pjson.config;
let args = minimist(process.argv.slice(2));
let dirs = config.directories;
let taskTarget = args.production ? dirs.destination : dirs.temporary;

// This will grab all js in the `gulp` directory
// in order to load all gulp tasks
wrench.readdirSyncRecursive('./gulp').filter((file) => {
  return (/\.(js)$/i).test(file);
}).map(function(file) {
  require('./gulp/' + file)(gulp, plugins, args, config, taskTarget, null);
});

// Default task
gulp.task('default', ['clean'], () => {
  gulp.start('build');
});

// Build production-ready code
gulp.task('build', [
  'stylus',
  'browserify'
]);

// Server tasks with watch
gulp.task('serve', [
  'stylus',
  'browserify',
  'watch'
]);
