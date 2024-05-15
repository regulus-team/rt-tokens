import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DashboardRootComponent} from './components/dashboard-root/dashboard-root.component';
import {DashboardDetailsComponent} from './components/dashboard-details/dashboard-details.component';
import {RtWalletConnectedGuard} from '../rt-wallet/guards/rt-wallet-connected.guard';

const routes: Routes = [
  {
    path: '',
    component: DashboardRootComponent,
    children: [
      {
        path: '',
        component: DashboardDetailsComponent,
        canActivate: [RtWalletConnectedGuard],
        title: 'Details | Dashboard | Solana',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {
}
