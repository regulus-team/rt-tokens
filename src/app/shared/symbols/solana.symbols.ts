import {clusterApiUrl, Connection} from '@solana/web3.js';
import {PhantomWalletAdapter} from '@solana/wallet-adapter-wallets';
import {catchError, interval, map, of, switchMap, takeWhile} from 'rxjs';

/**
 * Solana lesser currency unit.
 * 1 Sol = 1_000_000_000 Lamports
 */
export type Lamports = number;

/**
 * Solana larger currency unit.
 * 1 Sol = 1_000_000_000 Lamports
 */
export type Sols = number;

/**
 * The transaction signature.
 * A transaction signature is a hash of a transaction that has been signed by the sender.
 */
export type TransactionSignature = string;

/**
 * The type of the network cluster.
 * A Solana cluster is a set of validators working together to serve client transactions and maintain the integrity of the ledger.
 * Many clusters may coexist.
 *
 * Docs: https://docs.solanalabs.com/clusters
 */
export type NetCluster = 'devnet' | 'testnet' | 'mainnet-beta';

/**
 * Current Solana network cluster.
 */
export const currentNetCluster: NetCluster = clusterApiUrl('devnet') as NetCluster;

/**
 * Current wallet adapter.
 * Used for working with the wallet.
 */
export const currentWalletAdapter = new PhantomWalletAdapter();

/**
 * Connection to the Solana network cluster.
 */
export const connectionToCluster = new Connection(currentNetCluster, 'confirmed');

// Todo: move to environment variables.
export const mainNetBetaRPCApi = 'http://api.mainnet-beta.solana.com/';
export const devNetRPCApi = 'http://api.devnet.solana.com/';

/**
 * Wait for the transaction signature to be confirmed.
 * @param transactionSignature - The transaction signature.
 * @param retryDelay - The delay between retries in milliseconds.
 * @param retryLimit - The maximum number of retries.
 */
export const waitForTransactionBySignature = (
  transactionSignature: TransactionSignature,
  retryDelay = 1000,
  retryLimit = 10,
): Promise<boolean> =>
  // Create a new promise, so the subscription can be handled inside it.
  new Promise((resolve, reject) => {
    // Create a new interval observable based on the retry delay.
    const subscription = interval(retryDelay)
      .pipe(
        // Each interval, check the transaction status.
        switchMap(() =>
          connectionToCluster
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

        // Unexpected error occurred => promise rejected.
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
