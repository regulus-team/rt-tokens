import {CommonModule} from '@angular/common';
import {provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import {NgModule} from '@angular/core';

import {RtSvgSpriteComponent} from './components/rt-svg-sprite.component';

@NgModule({
  declarations: [RtSvgSpriteComponent],
  exports: [RtSvgSpriteComponent],
  imports: [CommonModule],
  providers: [provideHttpClient(withInterceptorsFromDi())],
})
export class RtSvgSpriteModule {}
