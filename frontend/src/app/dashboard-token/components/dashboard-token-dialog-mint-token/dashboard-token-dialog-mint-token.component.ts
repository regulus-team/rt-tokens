import {filter, map, Observable, startWith, Subscription} from 'rxjs';
import {ChangeDetectionStrategy, Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Store} from '@ngxs/store';
import {PublicKey} from '@solana/web3.js';
import {DashboardTokenItemActionsState} from '../../states/dashboard-token-item-actions/dashboard-token-item-actions.state';
import {MintToken, ResetMintTokenProcess} from '../../states/dashboard-token-item-actions/dashboard-token-item-actions.actions';
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

  /** Current number of tokens on the user's balance. */
  currentBalance: string;

  /** Number of decimals in the token. */
  tokenDecimals: number;
}

@Component({
  selector: 'app-dashboard-token-dialog-mint-token',
  templateUrl: './dashboard-token-dialog-mint-token.component.html',
  styleUrls: ['./dashboard-token-dialog-mint-token.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardTokenDialogMintTokenComponent implements OnInit, OnDestroy {
  public readonly mintTokenProcess$ = this.store.select(DashboardTokenItemActionsState.mintTokenProcess);
  public readonly lastMintTokenError$ = this.store.select(DashboardTokenItemActionsState.lastMintTokenError);

  /** Available statuses for common progress processes. */
  public readonly progressStatuses = progressStatuses;

  /** Component subscriptions. Will be unsubscribed on component destroy. */
  public readonly subscription = new Subscription();

  /** Form for burning tokens. */
  public readonly mintTokenForm = new FormGroup({
    tokenAmount: new FormControl<number>(0, [Validators.min(0), Validators.pattern('^[0-9]*$')]),
  });

  /** Validation messages for the mint token amount control. */
  public readonly mintTokenAmountValidationMessages = {
    required: 'This field is required',
    min: 'The value must be greater than or equal to 0',
    pattern: 'The value must be an integer',
  };

  /** The estimated balance after minting the specified number of tokens. */
  public estimatedBalanceAfterMint$: Observable<number>;

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

    // Define the observable for the estimated balance after minting the specified number of tokens.
    this.estimatedBalanceAfterMint$ = this.mintTokenForm.controls.tokenAmount.valueChanges.pipe(
      // Start with the current value of the token amount control.
      startWith(this.mintTokenForm.controls.tokenAmount.value),

      // Apply the calculations.
      map(value => {
        // Extract the token decimals and balance from the injected data.
        const tokenDecimals = +this.injectedData.tokenDecimals;
        const tokenBalance = +this.injectedData.currentBalance;

        // Calculate the applied decimals.
        const appliedDecimals = Math.pow(10, -this.injectedData.tokenDecimals);

        // Ensure the input value is a number and is greater than 0.
        const safeInputValue = value && +value > 0 ? +value : 0;

        // Calculate the estimated balance after minting the specified number of tokens.
        return +(safeInputValue * appliedDecimals + tokenBalance).toFixed(tokenDecimals);
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
    if (!isActive || !tokenNumber || this.mintTokenForm.invalid) {
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
