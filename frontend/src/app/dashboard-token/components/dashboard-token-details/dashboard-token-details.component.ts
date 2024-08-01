import {BehaviorSubject, filter, map, Subject, Subscription, switchMap, take, timer} from 'rxjs';
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

  /** Indicates whether the item copied icon should be shown. */
  public showItemCopiedIcon$ = new BehaviorSubject(false);

  /** Subject for resetting the latest copied token address after a delay. */
  public resetLatestCopiedAddressAfterDelay$ = new Subject<void>();

  /** Delay before resetting the latest copied token address (ms). */
  public readonly resetLatestCopiedAddressDelay = 3000;

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

    // Reset the latest copied token address after a delay.
    this.subscription.add(
      this.resetLatestCopiedAddressAfterDelay$.pipe(switchMap(() => timer(this.resetLatestCopiedAddressDelay))).subscribe({
        next: () => {
          this.showItemCopiedIcon$.next(false);
        },
      }),
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  /**
   * Copy the token address to the clipboard.
   */
  public tokenAddressCopiedToClipboard($event: MouseEvent): void {
    // Prevent the click event from bubbling up.
    $event.stopPropagation();

    // Store the latest copied token address.
    this.showItemCopiedIcon$.next(true);
    this.resetLatestCopiedAddressAfterDelay$.next();
  }

  /**
   * Open the dialog window for minting a new token.
   */
  public openMintTokenDialog(tokenAccountPublicKey: Nullable<PublicKey>, associatedTokenAccountPublicKey: Nullable<PublicKey>): void {
    // Mint dialog button is available only if it has mint authority, so consider the current wallet as mint authority.
    const mintAuthorityPublicKey = this.currentWalletAdapter.publicKey;

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
