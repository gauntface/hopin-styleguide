const path = require('path');
const gulp = require('gulp');
const fs = require('fs-extra');
const {setConfig} = require('@hopin/wbt-config');
const tsNode = require('@hopin/wbt-ts-node'); 

const src = path.join(__dirname, 'src');
const dst = path.join(__dirname, 'build');

setConfig(src, dst);

gulp.task('clean', async () => {
    await fs.remove(dst);
});

gulp.task('build',
  gulp.series(
    'clean',
    tsNode.gulpBuild()
  )
);