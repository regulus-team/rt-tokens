import {Injectable} from '@angular/core';
import {TOKEN_PROGRAM_ID} from '@solana/spl-token';
import {PublicKey, RpcResponseAndContext} from '@solana/web3.js';
import {RpcResponseTokenData} from '../../symbols';
import {connectionToCluster} from '../../../shared/symbols/solana.symbols';

@Injectable()
export class DashboardTokenService {

  /**
   * Load all associated token accounts for a given owner account.
   * @param publicKey - The public key of the owner account.
   */
  public loadAllAccountTokens(publicKey: PublicKey): Promise<RpcResponseAndContext<RpcResponseTokenData[]>> {
    return connectionToCluster.getParsedTokenAccountsByOwner(publicKey, {
      programId: TOKEN_PROGRAM_ID,
    });
  }
}
