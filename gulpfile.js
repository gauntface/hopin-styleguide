const path = require('path');
const {exec} = require('child_process');
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
    () => gulp.src(path.join(__dirname, 'gauntface', '**', '*')).pipe(gulp.dest(path.join(dst, 'gauntface'))),
    () => gulp.src(path.join(__dirname, 'third_party', '**', '*')).pipe(gulp.dest(path.join(dst, 'third_party'))),
  ),
);

gulp.task('css', css.gulpBuild());

gulp.task('ts', tsBrowser.gulpBuild('hopin.styleguide'));

gulp.task('static-site', (done) => exec('npm run static-site', (err, stdout, stderr) => {
  if (stdout) {
    console.log(stdout);
  }
  if (stderr) {
    console.log(stderr);
  }
  done(err);
}));

gulp.task('build',
  gulp.series(
    'clean',
    gulp.parallel(
      'copy',
      'css',
      'ts',
    ),
    'static-site',
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
      ignored: [
        path.join(dst, '**', '*'),
        path.join(__dirname, 'node_modules', '**', '*'),
      ],
      queue: true,
    };
    gulp.watch(path.join(__dirname, '**', '*.ts'), opts, gulp.series('ts', 'static-site'));
    gulp.watch(path.join(__dirname, '**', '*.css'), opts, gulp.series('css', 'static-site'));
    gulp.watch(path.join(__dirname, '**', '*'), opts, gulp.series('copy'));
    gulp.watch(path.join(__dirname, '**', '*.{md,tmpl}'), opts, gulp.series('static-site'));
  },
));