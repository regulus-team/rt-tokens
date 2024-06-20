import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {RtLoadingComponent} from './components/rt-loading/rt-loading.component';
import {RtPlatformModule} from '../rt-platform/rt-platform.module';

@NgModule({
  declarations: [RtLoadingComponent],
  imports: [CommonModule, MatProgressSpinnerModule, MatProgressBarModule, RtPlatformModule],
  exports: [RtLoadingComponent],
})
export class RtLoadingModule {}
