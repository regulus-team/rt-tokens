import {Injectable} from '@angular/core';
import {Connection, PublicKey, RpcResponseAndContext, SignatureResult} from '@solana/web3.js';
import {currentNetCluster, Lamports, NetCluster, TransactionSignature} from '../../../shared/symbols/solana.symbols';


@Injectable()
export class RtWalletService {
  /** Stores the current cluster. */
  public readonly currentCluster: NetCluster = currentNetCluster;

  /** Stores the connection to the cluster. */
  public readonly connection = new Connection(this.currentCluster, 'confirmed');

  /**
   * Provides the balance of the wallet for the given public key.
   */
  public getWalletBalance(publicKey: PublicKey): Promise<Lamports> {
    return this.connection.getBalance(publicKey);
  }

  /**
   * Requests an airdrop of Lamports to the wallet.
   */
  public requestAirdrop(publicKey: PublicKey, lamportsAmount: Lamports): Promise<TransactionSignature> {
    return this.connection.requestAirdrop(publicKey, lamportsAmount);
  }

  /**
   * Confirms the airdrop of Lamports to the wallet.
   */
  public confirmAirdrop(transactionSignature: TransactionSignature): Promise<RpcResponseAndContext<SignatureResult>> {
    return this.connection.confirmTransaction(transactionSignature);
  }
}
