import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {RtWalletAuthRootComponent} from './components/rt-wallet-auth-root/rt-wallet-auth-root.component';
import {RtWalletAuthLoginComponent} from './components/rt-wallet-auth-login/rt-wallet-auth-login.component';

const routes: Routes = [
  {
    path: '',
    component: RtWalletAuthRootComponent,
    children: [
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
      },
      {
        path: 'login',
        component: RtWalletAuthLoginComponent,
        title: 'Login | Authentication | Solana',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RtWalletAuthRoutingModule {
}
