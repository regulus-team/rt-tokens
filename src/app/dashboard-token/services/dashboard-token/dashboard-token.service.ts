import {Injectable} from '@angular/core';
import {createMintToInstruction, TOKEN_PROGRAM_ID} from '@solana/spl-token';
import {AccountInfo, PublicKey, RpcResponseAndContext, Transaction} from '@solana/web3.js';
import {connectionToCluster, currentWalletAdapter} from '../../../shared/symbols/solana.symbols';
import {
  RpcResponseAssociatedTokenAccount,
  RpcResponseTokenAccount,
  RpcResponseTokenData,
  RpcResponseUserAccount,
} from '../../symbols/dashboard-token-rcp-responce.symbols';
import {MintTokenActionData} from '../../symbols/dashboard-token-action-data.symbols';

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

  /**
   * Load the user account data.
   *
   * !NOTE: This method has no additional checks.
   * Providing a wrong user account public key will result in unexpected response which may lead to type mismatch.
   * @param userAccount - The public key of the user account.
   */
  public loadUserAccountData(userAccount: PublicKey): Promise<RpcResponseAndContext<RpcResponseUserAccount>> {
    return connectionToCluster.getParsedAccountInfo(userAccount) as unknown as Promise<RpcResponseAndContext<RpcResponseUserAccount>>;
  }

  /**
   * Load the token account data (holds the token).
   *
   * !NOTE: This method has no additional checks.
   * Providing a wrong user account public key will result in unexpected response which may lead to type mismatch.
   * @param tokenAccount - The public key of the token account.
   */
  public loadTokenAccountData(tokenAccount: PublicKey): Promise<RpcResponseAndContext<AccountInfo<RpcResponseTokenAccount>>> {
    return connectionToCluster.getParsedAccountInfo(tokenAccount) as Promise<RpcResponseAndContext<AccountInfo<RpcResponseTokenAccount>>>;
  }

  /**
   * Load the associated token account data (holds the token metadata).
   *
   * !NOTE: This method has no additional checks.
   * Providing a wrong user account public key will result in unexpected response which may lead to type mismatch.
   * @param associatedTokenAccount - The public key of the associated token account.
   */
  public loadAssociatedTokenAccountData(
    associatedTokenAccount: PublicKey,
  ): Promise<RpcResponseAndContext<AccountInfo<RpcResponseAssociatedTokenAccount>>> {
    return connectionToCluster.getParsedAccountInfo(associatedTokenAccount) as Promise<
      RpcResponseAndContext<AccountInfo<RpcResponseAssociatedTokenAccount>>
    >;
  }

  /**
   * Mint a specific number of tokens.
   * @param mintTokenActionData - Data required to mint tokens.
   */
  public mintSpecificToken(mintTokenActionData: MintTokenActionData): Promise<string> {
    // Create a transaction that mints tokens.
    const transaction = new Transaction().add(
      createMintToInstruction(
        mintTokenActionData.associatedTokenAccountPublicKey,
        mintTokenActionData.tokenAccountPublicKey,
        mintTokenActionData.mintAuthorityPublicKey,
        mintTokenActionData.tokenNumber,
      ),
    );

    // Request the wallet to sign the transaction and send it to the cluster.
    return currentWalletAdapter.sendTransaction(transaction, connectionToCluster);
  }
}
