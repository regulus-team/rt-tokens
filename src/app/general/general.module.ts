import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {GeneralFooterComponent} from './components/general-footer/general-footer.component';
import {GeneralHeaderComponent} from './components/general-header/general-header.component';
import {RouterLink, RouterModule} from '@angular/router';
import {GeneralNotFoundComponent} from './components/general-not-found/general-not-found.component';
import {MatButtonModule} from '@angular/material/button';

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
    RouterModule
  ],
  providers: [],
  exports: [
    GeneralFooterComponent,
    GeneralHeaderComponent,
  ],
})
export class GeneralModule {
}
