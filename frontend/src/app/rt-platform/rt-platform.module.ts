import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RtPlatformService} from './services/rt-platform/rt-platform.service';
import {WINDOW, RtPlatformWindowService} from './services/rt-platform-window/rt-platform-window.service';

export const factoryFn = (windowService: RtPlatformWindowService): Window => windowService.nativeWindow;

@NgModule({
  declarations: [],
  imports: [CommonModule],
  providers: [RtPlatformService, RtPlatformWindowService, {provide: WINDOW, useFactory: factoryFn, deps: [RtPlatformWindowService]}],
})
export class RtPlatformModule {}
