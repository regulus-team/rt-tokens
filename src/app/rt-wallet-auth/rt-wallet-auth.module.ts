import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RtWalletAuthRootComponent} from './components/rt-wallet-auth-root/rt-wallet-auth-root.component';
import {RtWalletAuthLoginComponent} from './components/rt-wallet-auth-login/rt-wallet-auth-login.component';
import {RouterOutlet} from '@angular/router';
import {RtWalletAuthRoutingModule} from './rt-wallet-auth-routing.module';

@NgModule({
  declarations: [
    RtWalletAuthRootComponent,
    RtWalletAuthLoginComponent,
  ],
  imports: [
    CommonModule,
    RouterOutlet,
    RtWalletAuthRoutingModule,
  ],
})
export class RtWalletAuthModule {
}
