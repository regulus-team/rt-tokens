import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatCardModule} from '@angular/material/card';
import {MatDividerModule} from '@angular/material/divider';
import {NgxsModule} from '@ngxs/store';
import {DashboardTokenRootComponent} from './components/dashboard-token-root/dashboard-token-root.component';
import {DashboardTokenRoutingModule} from './dashboard-token-routing.module';
import {DashboardTokenListComponent} from './components/dashboard-token-list/dashboard-token-list.component';
import {DashboardTokenService} from './services/dashboard-token/dashboard-token.service';
import {DashboardTokenState} from './states/dashboard-token/dashboard-token.state';
import {DashboardTokenDialogAddNewComponent} from './components/dashboard-token-dialog-add-new/dashboard-token-dialog-add-new.component';
import {RtWalletModule} from '../rt-wallet/rt-wallet.module';
import {MatButton} from '@angular/material/button';
import {DashboardTokenDetailsComponent} from './components/dashboard-token-details/dashboard-token-details.component';
import {DashboardTokenDialogMintTokenComponent} from './components/dashboard-token-dialog-mint-token/dashboard-token-dialog-mint-token.component';

@NgModule({
  declarations: [
    DashboardTokenRootComponent,
    DashboardTokenListComponent,
    DashboardTokenDetailsComponent,
    DashboardTokenDialogAddNewComponent,
    DashboardTokenDialogMintTokenComponent,
  ],
  imports: [
    CommonModule,
    DashboardTokenRoutingModule,
    NgxsModule.forFeature([DashboardTokenState]),
    RtWalletModule,
    MatCardModule,
    MatDividerModule,
    MatButton,
  ],
  providers: [DashboardTokenService],
})
export class DashboardTokenModule {}
