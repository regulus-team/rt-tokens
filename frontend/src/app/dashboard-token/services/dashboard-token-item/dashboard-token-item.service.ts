import {catchError, map, Observable, of} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {createMintToInstruction} from '@solana/spl-token';
import {AccountInfo, PublicKey, RpcResponseAndContext, Transaction} from '@solana/web3.js';
import {createAndMint, mplTokenMetadata, safeFetchMetadata, TokenStandard} from '@metaplex-foundation/mpl-token-metadata';
import {Metadata} from '@metaplex-foundation/mpl-token-metadata/dist/src/generated/accounts/metadata';
import {walletAdapterIdentity} from '@metaplex-foundation/umi-signer-wallet-adapters';
import {generateSigner, percentAmount, some} from '@metaplex-foundation/umi';
import {RpcResponseAssociatedTokenAccount, RpcResponseTokenAccount} from '../../symbols/dashboard-token-rcp-responce.symbols';
import {MintTokenActionData} from '../../symbols/dashboard-token-action-data.symbols';
import {JsonUrlTokenAccountPair, MetadataJsonFieldsTokenAccountPair} from '../../symbols/dashboard-token-metadata-retrieval.symbols';
import {RtSolanaService} from '../../../rt-solana/services/rt-solana/rt-solana.service';
import {MetadataJsonFields, UmiPublicKey} from '../../../rt-solana/symbols';

@Injectable()
export class DashboardTokenItemService {
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
    private http: HttpClient,
    private rtSolana: RtSolanaService,
  ) {}

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
   * Load the list of token metadata by their mint accounts.
   * @param metadataAccount - The address of Metaplex token metadata account.
   */
  public loadTokenMetadata(metadataAccount: UmiPublicKey): Promise<Nullable<Metadata>> {
    // Get a new UMI instance for the current network cluster.
    const umi = this.rtSolana.getNewUmiInstance();

    // Update the UMI instance with the current RPC URL and the Metaplex token metadata plugin.
    umi.use(mplTokenMetadata()).use(walletAdapterIdentity(this.rtSolana.currentWalletAdapter));

    // Fetch the metadata.
    return safeFetchMetadata(umi, metadataAccount);
  }

  /**
   * Load the token metadata JSON files by its URL.
   * @param jsonUrlTokenAccountPair - The list of JSON URL and token account pairs.
   */
  public loadTokenMetadataJsonByUrl(
    jsonUrlTokenAccountPair: JsonUrlTokenAccountPair,
  ): Observable<MetadataJsonFieldsTokenAccountPair<Nullable<MetadataJsonFields>>> {
    return this.http.get<MetadataJsonFields>(jsonUrlTokenAccountPair.jsonUrl).pipe(
      // Provide an empty value in case of an error to avoid breaking the whole forkJoin request.
      catchError(() => of(null)),

      // Map the JSON metadata to the token account.
      map(jsonMetadata => ({jsonMetadata, tokenAccount: jsonUrlTokenAccountPair.tokenAccount})),
    );
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
    // Create new UMI instance with the current RPC URL and the Metaplex token metadata plugin.
    const umi = this.rtSolana.getNewUmiInstance();
    umi.use(mplTokenMetadata()).use(walletAdapterIdentity(this.currentWalletAdapter));

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
