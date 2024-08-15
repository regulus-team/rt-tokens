import {catchError, map, Observable, of} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {AccountInfo, PublicKey, RpcResponseAndContext} from '@solana/web3.js';
import {mplTokenMetadata, safeFetchMetadata} from '@metaplex-foundation/mpl-token-metadata';
import {Metadata} from '@metaplex-foundation/mpl-token-metadata/dist/src/generated/accounts/metadata';
import {walletAdapterIdentity} from '@metaplex-foundation/umi-signer-wallet-adapters';
import {RpcResponseAssociatedTokenAccount, RpcResponseTokenAccount} from '../../symbols/dashboard-token-rcp-responce.symbols';
import {JsonUrlTokenAccountPair, MetadataJsonFieldsTokenAccountPair} from '../../symbols/dashboard-token-metadata-retrieval.symbols';
import {UmiPublicKey} from '../../symbols/dashboard-token-resolve-non-compatible-types.symbols';
import {RtSolanaService} from '../../../rt-solana/services/rt-solana/rt-solana.service';
import {MetadataJsonFields} from '../../../rt-solana/symbols';

@Injectable()
export class DashboardTokenItemService {
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
}
