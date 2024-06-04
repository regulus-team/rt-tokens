import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Store} from '@ngxs/store';
import {LoadTokenList} from '../../states/dashboard-token/dashboard-token.actions';
import {currentWalletAdapter} from '../../../shared/symbols/solana.symbols';

@Component({
  selector: 'app-dashboard-token-root',
  templateUrl: './dashboard-token-root.component.html',
  styleUrls: ['./dashboard-token-root.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardTokenRootComponent implements OnInit {
  constructor(private store: Store) {
  }

  ngOnInit(): void {
    // Extract the public key from the wallet adapter.
    // It can be null as the page is protected by the router guard.
    const currentAccount: PublicKeyString = currentWalletAdapter.publicKey?.toString() as PublicKeyString;

    // Initialize the token list loading process.
    this.store.dispatch(new LoadTokenList(currentAccount));
  }
}
