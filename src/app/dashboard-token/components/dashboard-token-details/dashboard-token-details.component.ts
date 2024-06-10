import {filter, map, Subscription, take} from 'rxjs';
import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {PublicKey} from '@solana/web3.js';
import {Store} from '@ngxs/store';
import {
  DashboardTokenDialogMintTokenComponent,
  DialogMintTokenData,
} from '../dashboard-token-dialog-mint-token/dashboard-token-dialog-mint-token.component';
import {LoadTokenDetails} from '../../states/dashboard-token/dashboard-token.actions';
import {DashboardTokenState} from '../../states/dashboard-token/dashboard-token.state';
import {currentWalletAdapter} from '../../../shared/symbols/solana.symbols';
import {tokenDetailsProgressStatuses} from '../../symbols/dashboard-token-general.symbols';

@Component({
  selector: 'app-dashboard-token-details',
  templateUrl: './dashboard-token-details.component.html',
  styleUrls: ['./dashboard-token-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardTokenDetailsComponent implements OnInit, OnDestroy {
  public readonly loadTokenDetailsProcess$ = this.store.select(DashboardTokenState.loadTokenDetailsProcess);
  public readonly tokenAccount$ = this.store.select(DashboardTokenState.tokenAccount);
  public readonly associatedTokenAccount$ = this.store.select(DashboardTokenState.associatedTokenAccount);
  public readonly tokenAmount$ = this.store.select(DashboardTokenState.tokenAmount);
  public readonly supply$ = this.store.select(DashboardTokenState.supply);
  public readonly mintAuthority$ = this.store.select(DashboardTokenState.mintAuthority);
  public readonly freezeAuthority$ = this.store.select(DashboardTokenState.freezeAuthority);
  public readonly lastLoadTokenDetailsError$ = this.store.select(DashboardTokenState.lastLoadTokenDetailsError);

  /** Current user's public key. */
  public readonly currentUserPublicKey: PublicKey = currentWalletAdapter.publicKey as PublicKey;

  /** Progress statuses of the token details loading. */
  public readonly tokenDetailsProgressStatuses = tokenDetailsProgressStatuses;

  /** Component's subscriptions. Will be unsubscribed when the component is destroyed. */
  private readonly subscription = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private store: Store,
  ) {}

  ngOnInit(): void {
    // Load token details when the route changes.
    this.subscription.add(
      this.route.params
        .pipe(
          // Extract the token id from the route.
          map(params => params?.['id']),

          // Filter out the empty values.
          filter(tokenId => !!tokenId),
        )
        .subscribe(tokenId => {
          // Load details for the token.
          const tokenPublicKey = new PublicKey(tokenId);
          this.store.dispatch(new LoadTokenDetails(tokenPublicKey));
        }),
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  /**
   * Open the dialog window for minting a new token.
   */
  public openMintTokenDialog(tokenAccountPublicKey: Nullable<PublicKey>, associatedTokenAccountPublicKey: Nullable<PublicKey>): void {
    // Mint dialog button is available only if it has mint authority, so consider the current wallet as mint authority.
    const mintAuthorityPublicKey = currentWalletAdapter.publicKey;

    // If any of the required public keys is not set, do nothing.
    if (!tokenAccountPublicKey || !associatedTokenAccountPublicKey || !mintAuthorityPublicKey) {
      return;
    }

    this.dialog
      .open<DashboardTokenDialogMintTokenComponent, DialogMintTokenData>(DashboardTokenDialogMintTokenComponent, {
        data: {
          tokenAccountPublicKey,
          associatedTokenAccountPublicKey,
          mintAuthorityPublicKey,
        },
        backdropClass: ['rt-dialog'],
        hasBackdrop: true,
      })
      .afterClosed()
      .pipe(
        take(1),
        filter(data => !!data),
      )
      .subscribe({
        next: data => {
          console.log('Data received from the dialog window: ');
          console.log(data);
        },
      });
  }
}
