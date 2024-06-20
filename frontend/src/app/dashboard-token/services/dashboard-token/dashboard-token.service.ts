import {Injectable} from '@angular/core';
import {createMintToInstruction, TOKEN_PROGRAM_ID} from '@solana/spl-token';
import {AccountInfo, clusterApiUrl, PublicKey, RpcResponseAndContext, Transaction} from '@solana/web3.js';
import {createUmi} from '@metaplex-foundation/umi-bundle-defaults';
import {createAndMint, mplTokenMetadata, TokenStandard} from '@metaplex-foundation/mpl-token-metadata';
import {walletAdapterIdentity} from '@metaplex-foundation/umi-signer-wallet-adapters';
import {generateSigner, percentAmount, some} from '@metaplex-foundation/umi';
import {
  RpcResponseAssociatedTokenAccount,
  RpcResponseTokenAccount,
  RpcResponseTokenData,
  RpcResponseUserAccount,
} from '../../symbols/dashboard-token-rcp-responce.symbols';
import {MintTokenActionData} from '../../symbols/dashboard-token-action-data.symbols';
import {RtSolanaService} from '../../../rt-solana/services/rt-solana/rt-solana.service';

@Injectable()
export class DashboardTokenService {
  /**
   * The current wallet adapter.
   * Used for all wallet-related operations.
   */
  public readonly currentWalletAdapter = this.rtSolana.currentWalletAdapter;

  /**
   * Connection to the current Solana network cluster.
   */
  public readonly currentClusterConnection = this.rtSolana.currentClusterConnection;

  constructor(private rtSolana: RtSolanaService) {}

  /**
   * Load all associated token accounts for a given owner account.
   * @param publicKey - The public key of the owner account.
   */
  public loadAllAccountTokens(publicKey: PublicKey): Promise<RpcResponseAndContext<RpcResponseTokenData[]>> {
    return this.currentClusterConnection.getParsedTokenAccountsByOwner(publicKey, {
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
    return this.currentClusterConnection.getParsedAccountInfo(userAccount) as unknown as Promise<
      RpcResponseAndContext<RpcResponseUserAccount>
    >;
  }

  /**
   * Load the token account data (holds the token).
   *
   * !NOTE: This method has no additional checks.
   * Providing a wrong user account public key will result in unexpected response which may lead to type mismatch.
   * @param tokenAccount - The public key of the token account.
   */
  public loadTokenAccountData(tokenAccount: PublicKey): Promise<RpcResponseAndContext<AccountInfo<RpcResponseTokenAccount>>> {
    return this.currentClusterConnection.getParsedAccountInfo(tokenAccount) as Promise<
      RpcResponseAndContext<AccountInfo<RpcResponseTokenAccount>>
    >;
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
    return this.currentClusterConnection.getParsedAccountInfo(associatedTokenAccount) as Promise<
      RpcResponseAndContext<AccountInfo<RpcResponseAssociatedTokenAccount>>
    >;
  }

  /**
   * Create a new fungible token.
   * @param tokenName - The name of the token.
   * @param tokenDecimals - The number of decimals for the token.
   * @param tokenMetadataIpfsUrl - The IPFS URL of the token metadata.
   */
  public async createFungibleToken(
    tokenName: string,
    tokenDecimals: number,
    tokenMetadataIpfsUrl: string,
  ): Promise<{
    result: {context: {slot: number}; value: {err: null | string | unknown}};
    signature: Uint8Array;
  }> {
    // Get API URL for the current network cluster.
    const currentRpcUrl = clusterApiUrl(this.rtSolana.currentNetCluster);

    // Create new UMI instance with the current RPC URL and the Metaplex token metadata plugin.
    const umi = createUmi(currentRpcUrl).use(mplTokenMetadata()).use(walletAdapterIdentity(this.currentWalletAdapter));

    // Generate a signer for the UMI instance.
    const umiSigner = generateSigner(umi);

    // Create a new token, associated account, metadata, and mint it.
    return createAndMint(umi, {
      mint: umiSigner,
      name: tokenName,
      uri: tokenMetadataIpfsUrl,
      sellerFeeBasisPoints: percentAmount(5.5),
      decimals: some(tokenDecimals), // for 0 decimals use some(0)
      tokenStandard: TokenStandard.Fungible,
    }).sendAndConfirm(umi);
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
    return this.currentWalletAdapter.sendTransaction(transaction, this.currentClusterConnection);
  }
}
