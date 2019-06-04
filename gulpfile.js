const path = require('path');
const gulp = require('gulp');
const fs = require('fs-extra');
const {setConfig} = require('@hopin/wbt-config');
const tsNode = require('@hopin/wbt-ts-node'); 
const tsBrowser = require('@hopin/wbt-ts-browser'); 

const src = path.join(__dirname, 'src');
const dst = path.join(__dirname, 'build');

setConfig(src, dst);

gulp.task('clean', async () => {
  await Promise.all([
    fs.remove(dst),
    fs.remove(path.join(__dirname, 'generated-styleguide')),
  ]);
});

gulp.task('build',
  gulp.series(
    'clean',
    gulp.parallel(
      tsNode.gulpBuild(),
      tsBrowser.gulpBuild('hopin.styleguide', {
        src: path.join(__dirname, 'template'),
        dst: path.join(__dirname, 'template', 'build'),
      }),
    ),
  )
);