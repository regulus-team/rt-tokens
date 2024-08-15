import {NgModule} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {MatCardModule} from '@angular/material/card';
import {MatDividerModule} from '@angular/material/divider';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CdkCopyToClipboard} from '@angular/cdk/clipboard';
import {MatButton} from '@angular/material/button';
import {MatTooltip} from '@angular/material/tooltip';
import {NgxsModule} from '@ngxs/store';
import {DashboardTokenRootComponent} from './components/dashboard-token-root/dashboard-token-root.component';
import {DashboardTokenRoutingModule} from './dashboard-token-routing.module';
import {DashboardTokenListComponent} from './components/dashboard-token-list/dashboard-token-list.component';
import {DashboardTokenItemService} from './services/dashboard-token-item/dashboard-token-item.service';
import {DashboardTokenItemState} from './states/dashboard-token-item/dashboard-token-item.state';
import {DashboardTokenDetailsComponent} from './components/dashboard-token-details/dashboard-token-details.component';
import {DashboardTokenDialogMintTokenComponent} from './components/dashboard-token-dialog-mint-token/dashboard-token-dialog-mint-token.component';
import {DashboardTokenListState} from './states/dashboard-token-list/dashboard-token-list.state';
import {DashboardTokenListService} from './services/dashboard-token-list/dashboard-token-list.service';
import {DashboardTokenItemActionsService} from './services/dashboard-token-item-actions/dashboard-token-item-actions.service';
import {DashboardTokenItemActionsState} from './states/dashboard-token-item-actions/dashboard-token-item-actions.state';
import {RtWalletModule} from '../rt-wallet/rt-wallet.module';
import {RtLoadingModule} from '../rt-loading/rt-loading.module';
import {RtIpfsModule} from '../rt-ipfs/rt-ipfs.module';
import {SharedCopyActionComponent} from '../shared/components/shared-copy-action/shared-copy-action.component';
import {settings} from '../../environments/environment.dev';
import {DashboardTokenDialogBurnTokenComponent} from './components/dashboard-token-dialog-burn-token/dashboard-token-dialog-burn-token.component';
import {RtInputsInlineTextComponent} from '../rt-inputs/components/rt-inputs-inline-text/rt-inputs-inline-text.component';
import {DashboardTokenDialogTransferTokenComponent} from './components/dashboard-token-dialog-transfer-token/dashboard-token-dialog-transfer-token.component';

@NgModule({
  declarations: [
    DashboardTokenRootComponent,
    DashboardTokenListComponent,
    DashboardTokenDetailsComponent,
    DashboardTokenDialogMintTokenComponent,
    DashboardTokenDialogBurnTokenComponent,
    DashboardTokenDialogTransferTokenComponent,
  ],
  imports: [
    CommonModule,
    DashboardTokenRoutingModule,
    NgxsModule.forFeature([DashboardTokenItemState, DashboardTokenItemActionsState, DashboardTokenListState]),
    RtWalletModule,
    MatCardModule,
    MatDividerModule,
    MatButton,
    FormsModule,
    ReactiveFormsModule,
    RtLoadingModule,
    RtIpfsModule.forRoot({
      ipfsPublicDataGatewayUrl: settings.pinataApiGatewayUrl,
      ipfsApiUrl: settings.pinataApiUrl,
      ipfsApiKey: settings.pinataApiKey,
      ipfsApiKeySecret: settings.pinataApiKeySecret,
    }),
    NgOptimizedImage,
    CdkCopyToClipboard,
    MatTooltip,
    SharedCopyActionComponent,
    RtInputsInlineTextComponent,
  ],
  providers: [DashboardTokenItemService, DashboardTokenListService, DashboardTokenItemActionsService],
})
export class DashboardTokenModule {}
