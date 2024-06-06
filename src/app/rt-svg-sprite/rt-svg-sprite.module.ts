import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';

import {RtSvgSpriteComponent} from './components/rt-svg-sprite.component';

@NgModule({
  declarations: [RtSvgSpriteComponent],
  exports: [RtSvgSpriteComponent],
  imports: [CommonModule, HttpClientModule],
})
export class RtSvgSpriteModule {}
