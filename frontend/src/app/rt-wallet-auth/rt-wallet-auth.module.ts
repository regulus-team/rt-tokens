import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterOutlet} from '@angular/router';
import {MatCard, MatCardContent} from '@angular/material/card';
import {MatButton} from '@angular/material/button';
import {RtWalletAuthRootComponent} from './components/rt-wallet-auth-root/rt-wallet-auth-root.component';
import {RtWalletAuthLoginComponent} from './components/rt-wallet-auth-login/rt-wallet-auth-login.component';
import {RtWalletAuthRoutingModule} from './rt-wallet-auth-routing.module';
import {RtWalletModule} from '../rt-wallet/rt-wallet.module';

@NgModule({
  declarations: [RtWalletAuthRootComponent, RtWalletAuthLoginComponent],
  imports: [CommonModule, RouterOutlet, RtWalletAuthRoutingModule, MatCard, MatCardContent, MatButton, RtWalletModule],
})
export class RtWalletAuthModule {}
