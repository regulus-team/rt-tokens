import {NgModule} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {MatCardModule} from '@angular/material/card';
import {MatDividerModule} from '@angular/material/divider';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatButton} from '@angular/material/button';
import {NgxsModule} from '@ngxs/store';
import {DashboardTokenRootComponent} from './components/dashboard-token-root/dashboard-token-root.component';
import {DashboardTokenRoutingModule} from './dashboard-token-routing.module';
import {DashboardTokenListComponent} from './components/dashboard-token-list/dashboard-token-list.component';
import {DashboardTokenService} from './services/dashboard-token/dashboard-token.service';
import {DashboardTokenState} from './states/dashboard-token/dashboard-token.state';
import {DashboardTokenDetailsComponent} from './components/dashboard-token-details/dashboard-token-details.component';
import {DashboardTokenDialogMintTokenComponent} from './components/dashboard-token-dialog-mint-token/dashboard-token-dialog-mint-token.component';
import {RtWalletModule} from '../rt-wallet/rt-wallet.module';
import {RtFormsModule} from '../rt-forms/rt-forms.module';
import {RtLoadingModule} from '../rt-loading/rt-loading.module';
import {RtIpfsModule} from '../rt-ipfs/rt-ipfs.module';
import {settings} from '../../environments/environment.dev';
import {CdkCopyToClipboard} from '@angular/cdk/clipboard';
import {MatTooltip} from '@angular/material/tooltip';

@NgModule({
  declarations: [
    DashboardTokenRootComponent,
    DashboardTokenListComponent,
    DashboardTokenDetailsComponent,
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
    FormsModule,
    RtFormsModule,
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
  ],
  providers: [DashboardTokenService],
})
export class DashboardTokenModule {}
