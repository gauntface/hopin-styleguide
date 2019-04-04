const path = require('path');
const http = require('http');
const gulp = require('gulp');
const fs = require('fs-extra');
const {setConfig} = require('@hopin/wbt-config');
const tsBrowser = require('@hopin/wbt-ts-browser'); 
const css = require('@hopin/wbt-css');
const serveStatic = require('serve-static');
const serveIndex = require('serve-index');
const finalhandler = require('finalhandler');

const src = path.join(__dirname, 'src');
const dst = path.join(__dirname, 'build');

setConfig(src, dst);

gulp.task('clean', async () => {
    await fs.remove(dst);
});

gulp.task('copy',
  gulp.parallel(
    () => gulp.src(path.join(src, '**', '*.html')).pipe(gulp.dest(dst)),
    () => gulp.src(path.join(__dirname, 'example', '**', '*')).pipe(gulp.dest(path.join(dst, 'example'))),
  ),
);

gulp.task('css', css.gulpBuild());

gulp.task('ts', tsBrowser.gulpBuild('hopin.styleguide'));

gulp.task('build',
  gulp.series(
    'clean',
    gulp.parallel(
      'copy',
      'css',
      'ts',
    ),
  )
);

gulp.task('server', () => {
  const index = serveIndex(dst, {'icons': true});
  const serve = serveStatic(dst);
  const server = http.createServer(function onRequest(req, res){
    const done = finalhandler(req, res);
    serve(req, res, function onNext(err) {
      if (err) return done(err);
      index(req, res, done);
    })
  });
  server.listen(9000);
});

gulp.task('watch', gulp.parallel(
  'server',
  () => {
    const opts = {
      ignoreInitial: false,
      queue: true,
    };
    gulp.watch(path.join(src, '**', '*.ts'), opts, gulp.series('ts'));
    gulp.watch(path.join(src, '**', '*.css'), opts, gulp.series('css'));
    gulp.watch(path.join(src, '**', '*'), opts, gulp.series('copy'));
  },
));