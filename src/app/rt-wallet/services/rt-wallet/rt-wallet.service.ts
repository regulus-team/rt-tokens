import {Injectable} from '@angular/core';
import {PublicKey, RpcResponseAndContext, SignatureResult} from '@solana/web3.js';
import {connectionToCluster, Lamports, TransactionSignature} from '../../../shared/symbols/solana.symbols';


@Injectable()
export class RtWalletService {
  /**
   * Provides the balance of the wallet for the given public key.
   */
  public getWalletBalance(publicKey: PublicKey): Promise<Lamports> {
    return connectionToCluster.getBalance(publicKey);
  }

  /**
   * Requests an airdrop of Lamports to the wallet.
   */
  public requestAirdrop(publicKey: PublicKey, lamportsAmount: Lamports): Promise<TransactionSignature> {
    return connectionToCluster.requestAirdrop(publicKey, lamportsAmount);
  }

  /**
   * Confirms the airdrop of Lamports to the wallet.
   */
  public confirmAirdrop(transactionSignature: TransactionSignature): Promise<RpcResponseAndContext<SignatureResult>> {
    return connectionToCluster.confirmTransaction(transactionSignature);
  }
}
