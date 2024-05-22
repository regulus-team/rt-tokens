import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgxsModule} from '@ngxs/store';
import {DashboardTokenRootComponent} from './components/dashboard-token-root/dashboard-token-root.component';
import {DashboardTokenRoutingModule} from './dashboard-token-routing.module';
import {DashboardTokenListComponent} from './components/dashboard-token-list/dashboard-token-list.component';
import {DashboardTokenService} from './services/dashboard-token/dashboard-token.service';
import {DashboardTokenState} from './states/dashboard-token/dashboard-token.state';
import {RtWalletModule} from '../rt-wallet/rt-wallet.module';
import {MatCardModule} from '@angular/material/card';
import {MatDividerModule} from '@angular/material/divider';

@NgModule({
  declarations: [
    DashboardTokenRootComponent,
    DashboardTokenListComponent,
  ],
  imports: [
    CommonModule,
    DashboardTokenRoutingModule,
    NgxsModule.forFeature([DashboardTokenState]),
    RtWalletModule,
    MatCardModule,
    MatDividerModule,
  ],
  providers: [DashboardTokenService],
})
export class DashboardTokenModule {
}
