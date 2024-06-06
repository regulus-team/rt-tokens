import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RtPlatformService} from './rt-platform.service';
import {WINDOW, WindowService} from './window.service';

export const factoryFn = (windowService: WindowService): Window => windowService.nativeWindow;

@NgModule({
  declarations: [],
  imports: [CommonModule],
  providers: [RtPlatformService, WindowService, {provide: WINDOW, useFactory: factoryFn, deps: [WindowService]}],
})
export class RtPlatformModule {}
