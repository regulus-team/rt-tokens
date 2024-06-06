import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {GeneralFooterComponent} from './components/general-footer/general-footer.component';
import {GeneralHeaderComponent} from './components/general-header/general-header.component';
import {RouterLink, RouterModule} from '@angular/router';
import {GeneralNotFoundComponent} from './components/general-not-found/general-not-found.component';
import {MatButtonModule} from '@angular/material/button';
import {RtSvgSpriteModule} from '../rt-svg-sprite/rt-svg-sprite.module';
import {RtPlatformModule} from '../rt-platform/rt-platform.module';
import {Settings} from '../../conf/settings';

@NgModule({
  declarations: [
    GeneralFooterComponent,
    GeneralHeaderComponent,
    GeneralNotFoundComponent,
  ],
  imports: [
    CommonModule,
    RouterLink,
    MatButtonModule,
    RouterModule,
    RtSvgSpriteModule,
    RtPlatformModule,
  ],
  providers: [Settings],
  exports: [
    GeneralFooterComponent,
    GeneralHeaderComponent,
  ],
})
export class GeneralModule {
}
