import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Store} from '@ngxs/store';
import {PublicKey} from '@solana/web3.js';
import {RtSolanaService} from '../../../rt-solana/services/rt-solana/rt-solana.service';
import {LoadTokenList} from '../../states/dashboard-token-list/dashboard-token-list.actions';

@Component({
  selector: 'app-dashboard-token-root',
  templateUrl: './dashboard-token-root.component.html',
  styleUrls: ['./dashboard-token-root.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardTokenRootComponent implements OnInit {
  constructor(
    private store: Store,
    private rtSolana: RtSolanaService,
  ) {}

  ngOnInit(): void {
    // Extract the public key from the wallet adapter.
    // It can be null as the page is protected by the router guard.
    const currentAccount: PublicKey = this.rtSolana.currentWalletAdapter.publicKey as PublicKey;

    // Initialize the token list loading process.
    this.store.dispatch(new LoadTokenList(currentAccount));
  }
}
