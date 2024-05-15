import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgxsModule} from '@ngxs/store';
import {RtWalletState} from './states/rt-wallet/rt-wallet.state';
import {RtWalletService} from './services/rt-wallet/rt-wallet.service';
import {RtWalletConnectedGuard} from './guards/rt-wallet-connected.guard';

@NgModule({
  imports: [
    CommonModule,
    NgxsModule.forFeature([RtWalletState]),
  ],
  providers: [RtWalletService, RtWalletConnectedGuard],
})
export class RtWalletModule {
}
