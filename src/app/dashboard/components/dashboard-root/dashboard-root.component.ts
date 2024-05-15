import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Store} from '@ngxs/store';
import {ConnectPhantomWallet} from '../../../rt-wallet/states/rt-wallet/rt-wallet.actions';
import {Connection, Transaction, VersionedBlockResponse} from '@solana/web3.js';
import {RtWalletService} from '../../../rt-wallet/services/rt-wallet/rt-wallet.service';

@Component({
  selector: 'app-dashboard-root',
  templateUrl: './dashboard-root.component.html',
  styleUrls: ['./dashboard-root.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardRootComponent {
}
