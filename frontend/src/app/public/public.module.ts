import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PublicRootComponent} from './components/public-root/public-root.component';
import {PublicDetailsComponent} from './components/public-details/public-details.component';
import {PublicRoutingModule} from './public-routing.module';
import {MatCardModule} from '@angular/material/card';

@NgModule({
  declarations: [
    PublicRootComponent,
    PublicDetailsComponent,
  ],
  imports: [
    CommonModule,
    PublicRoutingModule,
    MatCardModule,
  ],
  providers: [],
})
export class PublicModule {
}
