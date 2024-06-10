import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Keypair, PublicKey, SystemProgram, Transaction} from '@solana/web3.js';
import {
  createAssociatedTokenAccountInstruction,
  createInitializeMintInstruction,
  getAssociatedTokenAddress,
  MINT_SIZE,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token';
import {RtSolanaService} from '../../../rt-solana/services/rt-solana/rt-solana.service';

@Component({
  selector: 'app-dashboard-token-dialog-add-new',
  templateUrl: './dashboard-token-dialog-add-new.component.html',
  styleUrls: ['./dashboard-token-dialog-add-new.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardTokenDialogAddNewComponent {
  /**
   * The current wallet adapter.
   * Used for all wallet-related operations.
   */
  public readonly currentWalletAdapter = this.rtSolana.currentWalletAdapter;

  /**
   * Connection to the current Solana network cluster.
   */
  public readonly currentClusterConnection = this.rtSolana.currentClusterConnection;

  constructor(
    private rtSolana: RtSolanaService,
    private dialog: MatDialogRef<DashboardTokenDialogAddNewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {avatar: string},
  ) {}

  // Todo: add a form to the dialog window for setting the token metadata.

  /**
   * Create a new mint account and link it to the current wallet.
   */
  public async createMintAccount(decimals: number): Promise<void> {
    // Todo: move to the state.
    // Extract the current user's public key.
    const currentUserPubkey = this.currentWalletAdapter.publicKey as PublicKey;

    // Calculate the minimum balance needed for the mint account.
    const lamportsForRentNeeded = await this.currentClusterConnection.getMinimumBalanceForRentExemption(MINT_SIZE);

    // Create a new account which will be used as a mint.
    const mintAccountKeypair = Keypair.generate();

    // Get the associated token account address.
    const associatedTokenAddress = await getAssociatedTokenAddress(mintAccountKeypair.publicKey, currentUserPubkey, false);

    // Create a transaction with the instructions to create a new mint account.
    const transaction = new Transaction().add(
      // Create a new account.
      SystemProgram.createAccount({
        fromPubkey: currentUserPubkey,
        newAccountPubkey: mintAccountKeypair.publicKey,
        space: MINT_SIZE,
        lamports: lamportsForRentNeeded,
        programId: TOKEN_PROGRAM_ID,
      }),

      // Make the created account a mint (used for minting new tokens).
      createInitializeMintInstruction(mintAccountKeypair.publicKey, decimals, currentUserPubkey, currentUserPubkey, TOKEN_PROGRAM_ID),

      // Create an associated token account (used for storing tokens).
      createAssociatedTokenAccountInstruction(currentUserPubkey, associatedTokenAddress, currentUserPubkey, mintAccountKeypair.publicKey),
    );

    // Request the wallet to sign the transaction and send it to the cluster.
    const signedTransaction = await this.currentWalletAdapter.sendTransaction(transaction, this.currentClusterConnection, {
      signers: [mintAccountKeypair],
    });

    // Close the dialog and return the signed transaction.
    this.dialog.close(signedTransaction);
  }
}
