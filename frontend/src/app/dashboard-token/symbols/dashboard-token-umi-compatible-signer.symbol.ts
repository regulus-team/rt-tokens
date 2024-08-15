import {Signer} from '@metaplex-foundation/umi';
import {PhantomWalletAdapter} from '@solana/wallet-adapter-wallets';
import {
  SolPublicKey,
  SolTransaction,
  SolVersionedTransaction,
  toUmiPublicKey,
  UmiPublicKey,
  UmiTransaction,
} from './dashboard-token-resolve-non-compatible-types.symbols';

/**
 * Generates a signer compatible with the UMI library using the current wallet adapter.
 * Used for signing transactions and messages.
 */
export class UmiCompatibleSigner implements Signer {
  /** The public key of the signer. */
  public publicKey: UmiPublicKey;

  /** The wallet adapter used for signing. */
  private readonly walletAdapter: PhantomWalletAdapter;

  constructor(walletAdapter: PhantomWalletAdapter) {
    this.walletAdapter = walletAdapter;
    this.publicKey = toUmiPublicKey(walletAdapter.publicKey as SolPublicKey);
  }

  /** Signs a raw message. */
  public signMessage(message: Uint8Array): Promise<Uint8Array> {
    return this.walletAdapter.signMessage.apply(this.walletAdapter, [message]);
  }

  /**
   * Signs a transaction.
   */
  public signTransaction(transaction: UmiTransaction): Promise<UmiTransaction> {
    // Convert the transaction to the type expected by the wallet adapter if necessary
    return this.walletAdapter.signTransaction.apply(this.walletAdapter, [
      transaction as unknown as SolTransaction | SolVersionedTransaction,
    ]) as unknown as Promise<UmiTransaction>;
  }

  /**
   * Signs all transactions at once.
   * @param transactions
   */
  public signAllTransactions(transactions: UmiTransaction[]): Promise<UmiTransaction[]> {
    // Convert transactions to the type expected by the wallet adapter if necessary
    return this.walletAdapter.signAllTransactions.apply(this.walletAdapter, [
      transactions as unknown as SolTransaction[] | SolVersionedTransaction[],
    ]) as unknown as Promise<UmiTransaction[]>;
  }
}
