import {filter, map, Observable, startWith, Subscription} from 'rxjs';
import {ChangeDetectionStrategy, Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Store} from '@ngxs/store';
import {PublicKey} from '@solana/web3.js';
import {DashboardTokenItemActionsState} from '../../states/dashboard-token-item-actions/dashboard-token-item-actions.state';
import {ResetTransferTokenProcess, TransferToken} from '../../states/dashboard-token-item-actions/dashboard-token-item-actions.actions';
import {progressStatuses} from '../../../shared/symbols/statuses.symbols';
import {RtFormLabelsFromForm, RtValidationMessagesFromForm} from '../../../rt-inputs/symbols/rt-inputs-types.symbols';

/**
 * Data for the transfer token dialog.
 */
export interface DialogTransferTokenData {
  /** Public key of the associated token account (holds token metadata). */
  associatedTokenAccountPublicKey: PublicKey;

  /** Public key of the token account owner. */
  senderAccountPublicKey: PublicKey;

  /** Current number of tokens on the user's balance. */
  currentBalance: string;

  /** Current number of tokens on the user's balance before applying decimals. */
  currentBalanceWithoutDecimals: string;

  /** Number of decimals in the token. */
  tokenDecimals: number;
}

@Component({
  selector: 'app-dashboard-token-dialog-transfer-token',
  templateUrl: './dashboard-token-dialog-transfer-token.component.html',
  styleUrls: ['./dashboard-token-dialog-transfer-token.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardTokenDialogTransferTokenComponent implements OnInit, OnDestroy {
  public readonly transferTokenProcess$ = this.store.select(DashboardTokenItemActionsState.transferTokenProcess);
  public readonly lastTransferTokenError$ = this.store.select(DashboardTokenItemActionsState.lastTransferTokenError);

  /** Available statuses for common progress processes. */
  public readonly progressStatuses = progressStatuses;

  /** Component subscriptions. Will be unsubscribed on component destroy. */
  public readonly subscription = new Subscription();

  /** Form for transferring tokens. */
  public readonly transferTokenForm = new FormGroup({
    tokenAmount: new FormControl<number>(1, [
      Validators.required,
      Validators.min(1),
      Validators.max(+this.injectedData.currentBalanceWithoutDecimals),
      Validators.pattern('^[0-9]*$'),
    ]),
    destinationAddress: new FormControl<string>('', [Validators.required]),
  });

  /** Validation messages for the transfer token form. */
  public readonly validationMessages: RtValidationMessagesFromForm<typeof this.transferTokenForm> = {
    tokenAmount: {
      required: 'This field is required',
      min: 'The value must be greater than 0',
      max: 'You cannot transfer more tokens than you have',
      pattern: 'The value must be an integer',
    },
    destinationAddress: {
      required: 'This field is required',
    },
  };

  /** Relation of labels for the token transfer form. */
  public readonly labels: RtFormLabelsFromForm<typeof this.transferTokenForm> = {
    tokenAmount: 'Number of tokens',
    destinationAddress: 'Destination address',
  };

  /** The estimated balance after transferring the specified number of tokens. */
  public estimatedBalanceAfterTransfer$: Observable<number>;

  constructor(
    private store: Store,
    private dialogRef: MatDialogRef<DashboardTokenDialogTransferTokenComponent>,
    @Inject(MAT_DIALOG_DATA) public injectedData: DialogTransferTokenData,
  ) {}

  ngOnInit(): void {
    // Close the dialog once the transfer token process is completed.
    this.subscription.add(
      this.transferTokenProcess$.pipe(filter(process => process === progressStatuses.succeed)).subscribe(() => {
        this.dialogRef.close();
      }),
    );

    // Define the observable for the estimated balance after transferring the specified number of tokens.
    this.estimatedBalanceAfterTransfer$ = this.transferTokenForm.controls.tokenAmount.valueChanges.pipe(
      // Start with the current value of the token amount control.
      startWith(this.transferTokenForm.controls.tokenAmount.value),

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

    // Reset the transfer token process once the dialog is closed.
    this.store.dispatch(new ResetTransferTokenProcess());
  }

  /**
   * Transfer the specified number of tokens to the destination account.
   * @param isActive - Indicates whether the transfer button is active.
   * @param tokenNumber - Number of tokens to transfer.
   * @param destinationAddress - Address of the destination account.
   */
  public async transferToken(
    isActive: boolean,
    tokenNumber: Nullable<number>,
    destinationAddress: Nullable<PublicKeyString>,
  ): Promise<void> {
    // Avoid transferring if the button is disabled.
    if (!isActive || !tokenNumber || !destinationAddress || this.transferTokenForm.invalid) {
      return;
    }

    // Initialize the transferring process.
    this.store.dispatch(
      new TransferToken({
        tokenOwner: this.injectedData.senderAccountPublicKey,
        mint: this.injectedData.associatedTokenAccountPublicKey,
        destinationOwner: destinationAddress,
        amount: tokenNumber ?? 0,
      }),
    );
  }
}
