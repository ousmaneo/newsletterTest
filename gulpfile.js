var gulp = require("gulp");
var jshint = require("gulp-jshint");
var concat = require("gulp-concat");
var wrap = require("gulp-wrap");
var uglify = require("gulp-uglify");
var htmlmin = require("gulp-htmlmin");
var gulpif = require("gulp-if");
var sass = require("gulp-sass");
var yargs = require("yargs");
var ngAnnotate = require("gulp-ng-annotate");
var templateCache = require("gulp-angular-templatecache");
var server = require("browser-sync");
var del = require("del");
var path = require("path");
const debug = require("gulp-debug");
const argv = yargs.argv;

var paths = {
  dist: "./dist/",
  scripts: ["./src/app/**/*.js"],
  styles: ["./src/sass/*.scss"],
  templates: ["./src/app/**/*.html"],
  modules: [
    "angular/angular.js",
    "angular-ui-router/release/angular-ui-router.js",
    "angular-ui-bootstrap/dist/ui-bootstrap-tpls.js"
  ],
  static: ["./src/index.html", "./src/img/**/*", "./data/users.json"]
};

gulp.task("clean", cb => del(paths.dist + "**/*", cb));

gulp.task("templates", () => {
  return gulp
    .src(paths.templates)
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(
      templateCache({
        root: "app",
        standalone: true,
        transformUrl: function(url) {
          return url.replace(path.dirname(url), ".");
        }
      })
    )
    .pipe(gulp.dest("./"));
});

gulp.task(
  "modules",
  gulp.series("templates", () => {
    return gulp
      .src(paths.modules.map(item => "node_modules/" + item))
      .pipe(concat("vendor.js"))
      .pipe(gulpif(argv.deploy, uglify()))
      .pipe(gulp.dest(paths.dist + "js/"));
  })
);

gulp.task("styles", () => {
  return gulp
    .src(paths.styles)
    .pipe(sass({ outputStyle: "compressed" }))
    .pipe(gulp.dest(paths.dist + "css/"));
});

gulp.task(
  "scripts",
  gulp.series("modules", () => {
    console.log(paths.scripts);
    return gulp
      .src(["./src/app/**/*.module.js", ...paths.scripts, "./templates.js"], {
        allowEmpty: true
      })
      .pipe(
        wrap(
          "(function(angular){\n'use strict';\n<%= contents %>})(window.angular);"
        )
      )
      .pipe(concat("bundle.js"))
      .pipe(ngAnnotate())
      .pipe(gulpif(argv.deploy, uglify()))
      .pipe(gulp.dest(paths.dist + "js/"));
  })
);

gulp.task("serve", () => {
  return server.init({
    files: [`${paths.dist}/**`],
    port: 4000,
    server: {
      baseDir: paths.dist
    }
  });
});

gulp.task(
  "copy",
  gulp.series("clean", () => {
    return gulp.src(paths.static, { base: "src" }).pipe(gulp.dest(paths.dist));
  })
);
gulp.task("copy-data", function() {
  return gulp.src("./data/users.json").pipe(gulp.dest("./dist/data/"));
});
gulp.task(
  "watch",
  gulp.series("serve", "scripts", "styles", "copy", "copy-data", () => {
    gulp.watch([paths.scripts, paths.templates], ["scripts"]);
    gulp.watch(paths.styles, ["styles"]);
  })
);

gulp.task(
  "default",
  gulp.series("copy", "copy-data", "styles", "scripts", "serve", "watch")
);

gulp.task("jshint", function() {
  gulp
    .src(paths.scripts)
    .pipe(jshint(".jshintrc"))
    .pipe(jshint.reporter("jshint-stylish"));
});
