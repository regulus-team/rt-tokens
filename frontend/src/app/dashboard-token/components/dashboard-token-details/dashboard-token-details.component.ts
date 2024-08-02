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
import {LoadTokenDetails} from '../../states/dashboard-token-item/dashboard-token-item.actions';
import {DashboardTokenItemState} from '../../states/dashboard-token-item/dashboard-token-item.state';
import {tokenDetailsProgressStatuses} from '../../symbols/dashboard-token-general.symbols';
import {RtSolanaService} from '../../../rt-solana/services/rt-solana/rt-solana.service';

@Component({
  selector: 'app-dashboard-token-details',
  templateUrl: './dashboard-token-details.component.html',
  styleUrls: ['./dashboard-token-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardTokenDetailsComponent implements OnInit, OnDestroy {
  public readonly loadTokenDetailsProcess$ = this.store.select(DashboardTokenItemState.loadTokenDetailsProcess);
  public readonly tokenAccount$ = this.store.select(DashboardTokenItemState.tokenAccount);
  public readonly associatedTokenAccount$ = this.store.select(DashboardTokenItemState.associatedTokenAccount);
  public readonly tokenAmount$ = this.store.select(DashboardTokenItemState.tokenAmount);
  public readonly supply$ = this.store.select(DashboardTokenItemState.supply);
  public readonly tokenOwner$ = this.store.select(DashboardTokenItemState.tokenOwner);
  public readonly mintAuthority$ = this.store.select(DashboardTokenItemState.mintAuthority);
  public readonly freezeAuthority$ = this.store.select(DashboardTokenItemState.freezeAuthority);
  public readonly tokenMetadata$ = this.store.select(DashboardTokenItemState.tokenMetadata);
  public readonly tokenMetadataJson$ = this.store.select(DashboardTokenItemState.tokenMetadataJson);
  public readonly lastLoadTokenDetailsError$ = this.store.select(DashboardTokenItemState.lastLoadTokenDetailsError);

  /**
   * The current wallet adapter.
   * Used for all wallet-related operations.
   */
  public readonly currentWalletAdapter = this.rtSolana.currentWalletAdapter;

  /** Current user's public key. */
  public readonly currentUserPublicKey: PublicKey = this.currentWalletAdapter.publicKey as PublicKey;

  /** Progress statuses of the token details loading. */
  public readonly tokenDetailsProgressStatuses = tokenDetailsProgressStatuses;

  /** Component's subscriptions. Will be unsubscribed when the component is destroyed. */
  private readonly subscription = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private store: Store,
    private rtSolana: RtSolanaService,
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
  public openMintTokenDialog(dialogMintTokenData: Partial<DialogMintTokenData>): void {
    // If any of the required public keys is not set, do nothing.
    if (
      !dialogMintTokenData?.tokenAccountPublicKey ||
      !dialogMintTokenData?.associatedTokenAccountPublicKey ||
      !dialogMintTokenData?.mintAuthorityPublicKey
    ) {
      return;
    }

    // Open the dialog window.
    this.dialog.open<DashboardTokenDialogMintTokenComponent, DialogMintTokenData>(DashboardTokenDialogMintTokenComponent, {
      data: dialogMintTokenData as DialogMintTokenData,
      backdropClass: ['rt-dialog'],
      hasBackdrop: true,
    });
  }
}
