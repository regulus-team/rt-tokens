const gulp = require('gulp');
const svgSprite = require('gulp-svg-sprite');

const config = {
  mode: {
    symbol: {
      inline: true,
      sprite: 'sprites.svg'
    }
  }
};

gulp.task('svgSprite', function () {
  return gulp.src('src/assets/icons/*.svg') // Path to your SVG icons
    .pipe(svgSprite(config))
    .pipe(gulp.dest('src/assets/')); // Output path for the sprite
});
