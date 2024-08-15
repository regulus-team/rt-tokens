import {catchError, interval, map, of, switchMap, takeWhile} from 'rxjs';
import {Injectable} from '@angular/core';
import {clusterApiUrl, Connection, TransactionSignature} from '@solana/web3.js';
import {PhantomWalletAdapter} from '@solana/wallet-adapter-wallets';
import {createUmi} from '@metaplex-foundation/umi-bundle-defaults';
import {Pda, Umi} from '@metaplex-foundation/umi';
import {mplTokenMetadata} from '@metaplex-foundation/mpl-token-metadata';
import {walletAdapterIdentity} from '@metaplex-foundation/umi-signer-wallet-adapters';
import {findMetadataPda} from '@metaplex-foundation/mpl-token-metadata/dist/src/generated/accounts/metadata';
import {NetCluster} from '../../symbols';
import {Settings} from '../../../../conf/settings';
import {UmiPublicKey} from '../../../dashboard-token/symbols/dashboard-token-resolve-non-compatible-types.symbols';

/**
 * The RT Solana service.
 * Contains all the necessary methods and endpoints for working with the Solana network.
 */
@Injectable({
  providedIn: 'root',
})
export class RtSolanaService {
  /**
   * Current wallet adapter.
   * Used for all wallet-related operations.
   */
  public readonly currentWalletAdapter: PhantomWalletAdapter = new PhantomWalletAdapter();

  /**
   * Current network cluster.
   * Describes from which cluster the data should be handled.
   */
  public readonly currentNetCluster: NetCluster = this.settings.currentNetCluster;

  /**
   * Connection to the Solana network cluster.
   */
  public readonly currentClusterConnection: Connection = new Connection(clusterApiUrl(this.currentNetCluster), 'confirmed');

  constructor(private settings: Settings) {}

  /**
   * Get a new UMI instance with the current network cluster.
   */
  public getNewUmiInstance(): Umi {
    // Get API URL for the current network cluster.
    const currentRpcUrl = clusterApiUrl(this.currentNetCluster);

    // Create a new UMI instance and return it.
    return createUmi(currentRpcUrl);
  }

  /**
   * Get the Metaplex token metadata account address by the mint account.
   * @param mintAccount - The mint account public key.
   */
  public getMetaplexMetadataAccountAddressByMint(mintAccount: UmiPublicKey): Pda {
    // Get a new UMI instance for the current network cluster.
    const umi = this.getNewUmiInstance();

    // Update the UMI instance with the current RPC URL and the Metaplex token metadata plugin.
    umi.use(mplTokenMetadata()).use(walletAdapterIdentity(this.currentWalletAdapter));

    // Get the metadata account addresses.
    return findMetadataPda(umi, {mint: mintAccount});
  }

  /**
   * Wait for the transaction signature to be confirmed.
   * @param transactionSignature - The transaction signature.
   * @param retryDelay - The delay between retries in milliseconds.
   * @param retryLimit - The maximum number of retries.
   */
  public waitForTransactionBySignature(transactionSignature: TransactionSignature, retryDelay = 1000, retryLimit = 10): Promise<boolean> {
    // Create a new promise, so the subscription can be handled inside it.
    return new Promise((resolve, reject) => {
      // Create a new interval observable based on the retry delay.
      const subscription = interval(retryDelay)
        .pipe(
          // Each interval, check the transaction status.
          switchMap(() =>
            this.currentClusterConnection
              .getSignatureStatus(transactionSignature)
              .then(status => status.value)
              .catch(error => {
                console.error('Error checking transaction status', error);
                return null; // Handle fetch errors gracefully (consider only the current iteration as failed).
              }),
          ),

          // Map the status to a boolean value.
          map(status => status?.confirmationStatus === 'confirmed' || status?.confirmationStatus === 'finalized'),

          // Take while the transaction is not confirmed and the retry limit is not reached.
          takeWhile((isConfirmed, index) => !isConfirmed && index < retryLimit, true),

          // Consider any error as a failed confirmation.
          catchError(() => of(false)),
        )
        .subscribe({
          // Do not resolve promise until the transaction is confirmed or the retry limit is reached.
          next: confirmed => {
            if (confirmed) {
              subscription.unsubscribe();
              resolve(true);
            } else if (subscription.closed) {
              resolve(false);
            }
          },

          // Unexpected error occurred ⇒ promise rejected.
          error: error => {
            subscription.unsubscribe();
            reject(error);
          },

          // The observable completes without confirming the transaction.
          complete: () => {
            subscription.unsubscribe();
            resolve(false);
          },
        });
    });
  }
}
