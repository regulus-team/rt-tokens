import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DashboardTokenRootComponent} from './components/dashboard-token-root/dashboard-token-root.component';
import {DashboardTokenListComponent} from './components/dashboard-token-list/dashboard-token-list.component';
import {DashboardTokenDetailsComponent} from './components/dashboard-token-details/dashboard-token-details.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardTokenRootComponent,
    children: [
      {
        path: '',
        component: DashboardTokenListComponent,
        title: 'List | Tokens | Dashboard | Solana',
      },
      {
        path: ':id',
        component: DashboardTokenDetailsComponent,
        title: 'Item | Tokens | Dashboard | Solana',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardTokenRoutingModule {
}
