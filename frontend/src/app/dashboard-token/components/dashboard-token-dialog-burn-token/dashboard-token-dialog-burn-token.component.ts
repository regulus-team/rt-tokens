import {filter, map, Observable, startWith, Subscription} from 'rxjs';
import {ChangeDetectionStrategy, Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Store} from '@ngxs/store';
import {PublicKey} from '@solana/web3.js';
import {BurnToken, ResetBurnTokenProcess} from '../../states/dashboard-token-item-actions/dashboard-token-item-actions.actions';
import {DashboardTokenItemActionsState} from '../../states/dashboard-token-item-actions/dashboard-token-item-actions.state';
import {progressStatuses} from '../../../shared/symbols/statuses.symbols';
import {RtValidationMessagesFromForm} from '../../../rt-forms/symbols/rt-forms-types.symbols';

/**
 * Data for the mint token dialog.
 */
export interface DialogBurnTokenData {
  /** Public key of the token account (holds tokens). */
  tokenAccountPublicKey: PublicKey;

  /** Public key of the associated token account (holds token metadata). */
  associatedTokenAccountPublicKey: PublicKey;

  /** Public key of the account with the ownership authority over the token account. */
  tokenAccountOwnerPublicKey: PublicKey;

  /** Current number of tokens on the user's balance. */
  currentBalance: string;

  /** Current number of tokens on the user's balance before applying decimals. */
  currentBalanceWithoutDecimals: string;

  /** Number of decimals in the token. */
  tokenDecimals: number;
}

@Component({
  selector: 'app-dashboard-token-dialog-burn-token',
  templateUrl: './dashboard-token-dialog-burn-token.component.html',
  styleUrls: ['./dashboard-token-dialog-burn-token.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardTokenDialogBurnTokenComponent implements OnInit, OnDestroy {
  public readonly burnTokenProcess$ = this.store.select(DashboardTokenItemActionsState.burnTokenProcess);
  public readonly lastBurnTokenError$ = this.store.select(DashboardTokenItemActionsState.lastBurnTokenError);

  /** Form for burning tokens. */
  public readonly burnTokenForm = new FormGroup({
    tokenAmount: new FormControl<number>(0, [
      Validators.min(0),
      Validators.max(+this.injectedData.currentBalanceWithoutDecimals),
      Validators.pattern('^[0-9]*$'),
    ]),
  });

  public readonly rtValidationMessages: RtValidationMessagesFromForm<typeof this.burnTokenForm> = {
    tokenAmount: {
      required: 'This field is required',
      min: 'The value must be greater than or equal to 0',
      max: 'You cannot burn more tokens than you have',
      pattern: 'The value must be an integer',
    },
  };

  /** Available statuses for common progress processes. */
  public readonly progressStatuses = progressStatuses;

  /** Component subscriptions. Will be unsubscribed on component destroy. */
  public readonly subscription = new Subscription();

  /** The estimated balance after burning the specified number of tokens. */
  public estimatedBalanceAfterBurn$: Observable<number>;

  constructor(
    private store: Store,
    private dialogRef: MatDialogRef<DashboardTokenDialogBurnTokenComponent>,
    @Inject(MAT_DIALOG_DATA) public injectedData: DialogBurnTokenData,
  ) {}

  ngOnInit(): void {
    // Close the dialog once the burn token process is completed.
    this.subscription.add(
      this.burnTokenProcess$.pipe(filter(process => process === progressStatuses.succeed)).subscribe(() => {
        this.dialogRef.close();
      }),
    );

    // Define the observable for the estimated balance after burning the specified number of tokens.
    this.estimatedBalanceAfterBurn$ = this.burnTokenForm.controls.tokenAmount.valueChanges.pipe(
      // Start with the current value of the token amount control.
      startWith(this.burnTokenForm.controls.tokenAmount.value),

      // Apply the calculations.
      map(value => {
        // Extract the token decimals and balance from the injected data.
        const tokenDecimals = +this.injectedData.tokenDecimals;
        const tokenBalance = +this.injectedData.currentBalance;

        // Calculate the applied decimals.
        const appliedDecimals = Math.pow(10, -this.injectedData.tokenDecimals);

        // Ensure the input value is a number and is greater than 0.
        const safeInputValue = value && +value > 0 ? +value : 0;

        // Calculate the estimated balance after burning the specified number of tokens.
        return +(tokenBalance - safeInputValue * appliedDecimals).toFixed(tokenDecimals);
      }),
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();

    // Reset the burn token process once the dialog is closed.
    this.store.dispatch(new ResetBurnTokenProcess());
  }

  /**
   * Burn the specified number of tokens.
   * @param isActive - Indicates whether the burn button is active.
   * @param tokenNumber - Number of tokens to burn.
   */
  public async burnToken(isActive: boolean, tokenNumber: Nullable<number>): Promise<void> {
    // Avoid burning if the button is disabled or the form is invalid.
    if (!isActive || !tokenNumber || this.burnTokenForm.invalid) {
      return;
    }

    // Initialize the burning process.
    this.store.dispatch(
      new BurnToken({
        tokenAccountPublicKey: this.injectedData.tokenAccountPublicKey,
        associatedTokenAccountPublicKey: this.injectedData.associatedTokenAccountPublicKey,
        tokenAccountOwnerPublicKey: this.injectedData.tokenAccountOwnerPublicKey,
        tokenNumber: tokenNumber ?? 0,
      }),
    );
  }
}
