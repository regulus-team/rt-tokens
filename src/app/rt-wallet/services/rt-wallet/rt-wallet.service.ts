import {Injectable} from '@angular/core';
import {PublicKey, RpcResponseAndContext, SignatureResult} from '@solana/web3.js';
import {RtSolanaService} from '../../../rt-solana/services/rt-solana/rt-solana.service';
import {Lamports, TransactionSignature} from '../../../rt-solana/symbols';

@Injectable()
export class RtWalletService {
  /**
   * Connection to the current Solana network cluster.
   */
  public readonly currentClusterConnection = this.rtSolana.currentClusterConnection;

  constructor(private rtSolana: RtSolanaService) {}

  /**
   * Provides the balance of the wallet for the given public key.
   */
  public getWalletBalance(publicKey: PublicKey): Promise<Lamports> {
    return this.currentClusterConnection.getBalance(publicKey);
  }

  /**
   * Requests an airdrop of Lamports to the wallet.
   */
  public requestAirdrop(publicKey: PublicKey, lamportsAmount: Lamports): Promise<TransactionSignature> {
    return this.currentClusterConnection.requestAirdrop(publicKey, lamportsAmount);
  }

  /**
   * Confirms the airdrop of Lamports to the wallet.
   */
  public confirmAirdrop(transactionSignature: TransactionSignature): Promise<RpcResponseAndContext<SignatureResult>> {
    return this.currentClusterConnection.confirmTransaction(transactionSignature);
  }
}
