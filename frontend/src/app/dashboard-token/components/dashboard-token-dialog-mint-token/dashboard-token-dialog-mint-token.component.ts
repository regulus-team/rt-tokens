import {filter, Subscription} from 'rxjs';
import {ChangeDetectionStrategy, Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormControl} from '@angular/forms';
import {Store} from '@ngxs/store';
import {PublicKey} from '@solana/web3.js';
import {MintToken, ResetMintTokenProcess} from '../../states/dashboard-token/dashboard-token.actions';
import {DashboardTokenState} from '../../states/dashboard-token/dashboard-token.state';
import {progressStatuses} from '../../../shared/symbols/statuses.symbols';

/**
 * Data for the mint token dialog.
 */
export interface DialogMintTokenData {
  /** Public key of the token account (holds tokens). */
  tokenAccountPublicKey: PublicKey;

  /** Public key of the associated token account (holds token metadata). */
  associatedTokenAccountPublicKey: PublicKey;

  /** Public key of the account with the mint authority. */
  mintAuthorityPublicKey: PublicKey;
}

@Component({
  selector: 'app-dashboard-token-dialog-mint-token',
  templateUrl: './dashboard-token-dialog-mint-token.component.html',
  styleUrls: ['./dashboard-token-dialog-mint-token.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardTokenDialogMintTokenComponent implements OnInit, OnDestroy {
  public readonly mintTokenProcess$ = this.store.select(DashboardTokenState.mintTokenProcess);
  public readonly lastMintTokenError$ = this.store.select(DashboardTokenState.lastMintTokenError);

  /** Control for the token amount input. */
  public readonly tokenAmountControl = new FormControl<number>(0);

  /** Available statuses for common progress processes. */
  public readonly progressStatuses = progressStatuses;

  /** Component subscriptions. Will be unsubscribed on component destroy. */
  public readonly subscription = new Subscription();

  constructor(
    private store: Store,
    private dialogRef: MatDialogRef<DashboardTokenDialogMintTokenComponent>,
    @Inject(MAT_DIALOG_DATA) public injectedData: DialogMintTokenData,
  ) {}

  ngOnInit(): void {
    // Close the dialog once the mint token process is completed.
    this.subscription.add(
      this.mintTokenProcess$.pipe(filter(process => process === progressStatuses.succeed)).subscribe(() => {
        this.dialogRef.close();
      }),
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();

    // Reset the mint token process once the dialog is closed.
    this.store.dispatch(new ResetMintTokenProcess());
  }

  /**
   * Mint the specified number of tokens.
   * @param isActive - Indicates whether the mint button is active.
   * @param tokenNumber - Number of tokens to mint.
   */
  public async mintToken(isActive: boolean, tokenNumber: Nullable<number>): Promise<void> {
    // Avoid minting if the button is disabled.
    if (!isActive || !tokenNumber) {
      return;
    }

    // Initialize the minting process.
    this.store.dispatch(
      new MintToken({
        tokenAccountPublicKey: this.injectedData.tokenAccountPublicKey,
        associatedTokenAccountPublicKey: this.injectedData.associatedTokenAccountPublicKey,
        mintAuthorityPublicKey: this.injectedData.mintAuthorityPublicKey,
        tokenNumber: tokenNumber ?? 0,
      }),
    );
  }
}
