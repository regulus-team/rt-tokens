# Rt Svg Sprite

## About

The module provides a component that allows to use svg sprite in the project.

## Usage

### Import

Import `RtSvgSprite` into your module:

```ts

import {RtSvgSpriteModule} from './rt-svg-sprite/rt-svg-sprite.module';

@NgModule({  
  imports: 
    // ...,
    RtSvgSpriteModule,
  ...
})
export class SomeModule {}
```

### Add component

Add <rt-svg-sprite> component to your template:

```angular2html
...
<rt-svg-sprite></rt-svg-sprite>
...
```

It will be available as long as the template is present on the page. So you probably want to add it to the root component.

### Generate sprite

Add gulp and gulp-svg-sprite to your project's dev dependencies:

```bash
yarn add gulp gulp-svg-sprite --dev
```
or
```bash
npm install gulp gulp-svg-sprite --save-dev
```

Create gulpfile.js in the root of your project:

```js

const gulp = require('gulp');
const svgSprite = require('gulp-svg-sprite');

gulp.task('svgSprite', function () {
  return gulp.src('src/assets/icons/*.svg') // Path to your SVG icons
    .pipe(svgSprite(config))
    .pipe(gulp.dest('src/assets/')); // Output path for the sprite
});
```

Run the task:

```bash
gulp svgSprite
```
or add it to the package.json scripts:

```json
{
  "scripts": {
    "make-sprite": "gulp svgSprite"
  }
}
```
and run it with:

```bash
yarn make-sprite
```

All images from the src/assets/icons folder will be combined into a single sprite and saved to the src/assets/symbol folder.

While adding new icons, make sure you have replaced any color attributes with the "currentColor" value.
This will allow you to change the color of the icon using CSS.


### Use sprite

Add the following code to your template:

```angular2html
<svg>
  <use xlink:href="#icon-name"></use>
</svg>
```

## Why SVG sprite

### Performance Improvement

#### Reduced HTTP Requests
Instead of loading multiple image files, an SVG sprite consolidates all icons into a single file. This reduces the number of HTTP requests, enhancing page load speed.

#### Smaller File Sizes
SVG files are typically smaller than their raster counterparts (like PNGs or JPEGs), resulting in quicker downloads.

### Scalability and Quality

#### Resolution Independence
SVGs are vector-based, meaning they scale perfectly on any screen size or resolution without losing quality. This is crucial for responsive and retina displays.

#### Crisp and Clear
Icons remain sharp and clear, enhancing the visual quality of your website.

### Styling and Flexibility

#### CSS Styling
SVG elements can be styled using CSS, allowing for easy customization of colors, sizes, and animations.

#### Dynamic Manipulation
SVGs can be manipulated using JavaScript, enabling interactive and dynamic graphics.

### Accessibility

#### Search Engine Optimization
SVGs can be indexed by search engines, improving SEO.

#### Screen Readers
SVGs can include text descriptions and titles, making them accessible to screen readers.

### Maintenance

#### Single Source of Truth
Having all icons in a single sprite file simplifies maintenance. Updates to an icon are instantly reflected across the site without needing to update multiple files.
