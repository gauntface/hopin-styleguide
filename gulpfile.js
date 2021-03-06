const path = require('path');
const gulp = require('gulp');
const fs = require('fs-extra');
const express = require('express');
const serveIndex = require('serve-index');
const {setConfig} = require('@hopin/wbt-config');
const tsNode = require('@hopin/wbt-ts-node'); 
const tsBrowser = require('@hopin/wbt-ts-browser'); 
const {execSync} = require('child_process');

const src = path.join(__dirname, 'src');
const dst = path.join(__dirname, 'build');

setConfig(src, dst);

gulp.task('clean', async () => {
  await Promise.all([
    fs.remove(dst),
    fs.remove(path.join(__dirname, 'generated-styleguide')),
  ]);
});

gulp.task('build-template', gulp.series(
  tsBrowser.gulpBuild('hopin.styleguide', {
    src: path.join(__dirname, 'template'),
    dst: path.join(__dirname, 'template', 'build'),
  }),
))

gulp.task('build',
  gulp.series(
    'clean',
    gulp.parallel(
      tsNode.gulpBuild(),
      'build-template',
    ),
  )
);

gulp.task('watch', () => {
  startServer();
  
  gulp.watch([
      'src/**/*', 
    ],
    {
      delay: 1000,
      ignoreInitial: false,
    },
    gulp.series(
      'build',
      'build-demo',
    ),
  );

  gulp.watch([
      'template/**/*',
      '!template/build/**/*',
    ],
    {
      delay: 1000,
      ignoreInitial: true,
    },
    gulp.series(
      'build-template',
      'build-demo',
    ),
  );

  gulp.watch([
      path.join(getTheme(), 'build', '**', '*'),
    ], {
      delay: 1000,
      queue: true,
      ignoreInitial: true,
      usePolling: true,
    },
    gulp.series(
      'build-demo',
    ),  
  )
});

gulp.task('build-demo', function() {
  try {
    const stdOut = execSync(`node ./build/cli.js build --dir ${getTheme()}`);
    console.log(stdOut.toString());
    return Promise.resolve();
  } catch (err) {
    if (err.stdout) {
      console.log('Failed to build demo:', err, err.stdout.toString());
    } else {
      console.log('Failed to build demo:', err);
    }
    return Promise.reject(err);
  }
});

const staticDir = path.resolve(__dirname, 'generated-styleguide');
const PORT = 9000;
const app = express();
app.use(
  express.static(staticDir),
  serveIndex(staticDir, {'icons': true})
);

function startServer() {
  return new Promise((resolve, reject) => {
    app.listen(PORT, (error) => {
      if (error) {
        reject(error);
      } else {
        console.log(`The server is running @ http://localhost:${PORT}`);
        resolve();
      }
    });
  });
}

function getTheme() {
  return path.dirname(require.resolve('gauntface-theme/theme.json5'));
}