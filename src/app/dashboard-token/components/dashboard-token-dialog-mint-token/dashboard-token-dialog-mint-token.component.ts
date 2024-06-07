import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormControl} from '@angular/forms';
import {PublicKey, Transaction} from '@solana/web3.js';
import {createMintToInstruction} from '@solana/spl-token';
import {connectionToCluster, currentWalletAdapter} from '../../../shared/symbols/solana.symbols';

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
export class DashboardTokenDialogMintTokenComponent {
  public readonly tokenAmountControl = new FormControl<number>(0);

  constructor(
    private dialogRef: MatDialogRef<DashboardTokenDialogMintTokenComponent>,
    @Inject(MAT_DIALOG_DATA) public injectedData: DialogMintTokenData,
  ) {}

  /**
   * Mint the specified number of tokens.
   * @param tokenNumber - Number of tokens to mint.
   */
  public async mintToken(tokenNumber: Nullable<number>): Promise<void> {
    // If the amount is not set, do nothing.
    if (!tokenNumber) {
      return;
    }

    // Create a transaction that mints tokens.
    // Todo: move to the store.
    const transaction = new Transaction().add(
      createMintToInstruction(
        this.injectedData.associatedTokenAccountPublicKey,
        this.injectedData.tokenAccountPublicKey,
        this.injectedData.mintAuthorityPublicKey,
        tokenNumber,
      ),
    );

    // Request the wallet to sign the transaction and send it to the cluster.
    const signedTransaction = await currentWalletAdapter.sendTransaction(transaction, connectionToCluster);

    // Close the dialog and pass the signed transaction to the caller.
    this.dialogRef.close(signedTransaction);
  }
}
