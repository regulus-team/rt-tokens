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
import {RtFormsModule} from '../rt-forms/rt-forms.module';
import {RtLoadingModule} from '../rt-loading/rt-loading.module';

@NgModule({
  declarations: [GeneralFooterComponent, GeneralHeaderComponent, GeneralNotFoundComponent],
  imports: [CommonModule, RouterLink, MatButtonModule, RouterModule, RtSvgSpriteModule, RtPlatformModule, RtFormsModule, RtLoadingModule],
  providers: [Settings],
  exports: [GeneralFooterComponent, GeneralHeaderComponent],
})
export class GeneralModule {}
