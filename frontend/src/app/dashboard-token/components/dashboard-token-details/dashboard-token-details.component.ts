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
import {TokenItemState} from '../../symbols/dashboard-token-general.symbols';
import {FreezeOrThawTokenActionData} from '../../symbols/dashboard-token-action-data.symbols';
import {FreezeToken, ThawToken} from '../../states/dashboard-token-item-actions/dashboard-token-item-actions.actions';
import {RtSolanaService} from '../../../rt-solana/services/rt-solana/rt-solana.service';
import {
  ConfirmDialogData,
  SharedConfirmDialogComponent,
} from '../../../shared/components/shared-confirm-dialog/shared-confirm-dialog.component';
import {progressStatuses} from '../../../shared/symbols/statuses.symbols';
import {DashboardTokenItemActionsState} from '../../states/dashboard-token-item-actions/dashboard-token-item-actions.state';
import {
  DashboardTokenDialogBurnTokenComponent,
  DialogBurnTokenData,
} from '../dashboard-token-dialog-burn-token/dashboard-token-dialog-burn-token.component';

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
  public readonly tokenState$ = this.store.select(DashboardTokenItemState.tokenState);
  public readonly tokenOwner$ = this.store.select(DashboardTokenItemState.tokenOwner);
  public readonly mintAuthority$ = this.store.select(DashboardTokenItemState.mintAuthority);
  public readonly freezeAuthority$ = this.store.select(DashboardTokenItemState.freezeAuthority);
  public readonly tokenMetadata$ = this.store.select(DashboardTokenItemState.tokenMetadata);
  public readonly tokenMetadataJson$ = this.store.select(DashboardTokenItemState.tokenMetadataJson);
  public readonly lastLoadTokenDetailsError$ = this.store.select(DashboardTokenItemState.lastLoadTokenDetailsError);
  public readonly mintTokenProcess$ = this.store.select(DashboardTokenItemActionsState.mintTokenProcess);
  public readonly freezeTokenProcess$ = this.store.select(DashboardTokenItemActionsState.freezeTokenProcess);
  public readonly lastFreezeTokenError$ = this.store.select(DashboardTokenItemActionsState.lastFreezeTokenError);
  public readonly thawTokenProcess$ = this.store.select(DashboardTokenItemActionsState.thawTokenProcess);
  public readonly lastThawTokenError$ = this.store.select(DashboardTokenItemActionsState.lastThawTokenError);

  /**
   * The current wallet adapter.
   * Used for all wallet-related operations.
   */
  public readonly currentWalletAdapter = this.rtSolana.currentWalletAdapter;

  /** Current user's public key. */
  public readonly currentUserPublicKey: PublicKey = this.currentWalletAdapter.publicKey as PublicKey;

  /** Available statuses for common progress processes. */
  public readonly progressStatuses = progressStatuses;

  /** Token item states. */
  public readonly TokenItemState = TokenItemState;

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
   * Open the dialog window for minting new tokens.
   */
  public openMintTokenDialog(dialogMintTokenData: DialogMintTokenData): void {
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

  /**
   * Open the dialog window for burning tokens.
   */
  public openBurnTokenDialog(dialogBurnTokenData: DialogBurnTokenData): void {
    // If any of the required public keys is not set, do nothing.
    if (
      !dialogBurnTokenData?.tokenAccountPublicKey ||
      !dialogBurnTokenData?.associatedTokenAccountPublicKey ||
      !dialogBurnTokenData?.tokenAccountOwnerPublicKey
    ) {
      return;
    }

    // Open the dialog window.
    this.dialog.open<DashboardTokenDialogBurnTokenComponent, DialogBurnTokenData>(DashboardTokenDialogBurnTokenComponent, {
      data: dialogBurnTokenData,
      backdropClass: ['rt-dialog'],
      hasBackdrop: true,
    });
  }

  /**
   * Freeze the token.
   * Confirm the action before freezing the token.
   * Frozen token cannot be transferred, burned, or minted until it is thawed.
   */
  public confirmFreezeToken(freezeTokenActionData: FreezeOrThawTokenActionData): void {
    this.dialog
      .open<SharedConfirmDialogComponent, ConfirmDialogData>(SharedConfirmDialogComponent, {
        data: {
          caption: 'Are you sure you want to freeze the token?',
          detailsText: 'Frozen token cannot be transferred, burned, or minted until it is thawed',
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
        next: () => this.store.dispatch(new FreezeToken(freezeTokenActionData)),
      });
  }

  /**
   * Thaw the token.
   * Confirm the action before thawing the token.
   * Thawed token restores the possibility to be transferred, burned, or minted after being frozen.
   */
  public confirmThawToken(thawTokenActionData: FreezeOrThawTokenActionData): void {
    this.dialog
      .open<SharedConfirmDialogComponent, ConfirmDialogData>(SharedConfirmDialogComponent, {
        data: {
          caption: 'Are you sure you want to thaw the token?',
          detailsText: 'Thawed token restores the possibility to be transferred, burned, or minted after being frozen',
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
        next: () => this.store.dispatch(new ThawToken(thawTokenActionData)),
      });
  }
}
