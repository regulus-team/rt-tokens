import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {GeneralFooterComponent} from './components/general-footer/general-footer.component';
import {GeneralHeaderComponent} from './components/general-header/general-header.component';
import {RouterLink} from '@angular/router';
import {GeneralNotFoundComponent} from './components/general-not-found/general-not-found.component';

@NgModule({
  declarations: [
    GeneralFooterComponent,
    GeneralHeaderComponent,
    GeneralNotFoundComponent,
  ],
  imports: [
    CommonModule,
    RouterLink,
  ],
  providers: [],
  exports: [
    GeneralFooterComponent,
    GeneralHeaderComponent,
  ],
})
export class GeneralModule {
}
