import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PublicRootComponent} from './components/public-root/public-root.component';
import {PublicDetailsComponent} from './components/public-details/public-details.component';

const routes: Routes = [
  {
    path: '',
    component: PublicRootComponent,
    children: [
      {
        path: '',
        component: PublicDetailsComponent,
        title: 'Details | Public | Solana',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PublicRoutingModule {
}
