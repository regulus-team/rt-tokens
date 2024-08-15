import {catchError, forkJoin, map, Observable, of} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {TOKEN_PROGRAM_ID} from '@solana/spl-token';
import {PublicKey, RpcResponseAndContext} from '@solana/web3.js';
import {mplTokenMetadata} from '@metaplex-foundation/mpl-token-metadata';
import {walletAdapterIdentity} from '@metaplex-foundation/umi-signer-wallet-adapters';
import {Metadata, safeFetchAllMetadata} from '@metaplex-foundation/mpl-token-metadata/dist/src/generated/accounts/metadata';
import {RpcResponseTokenData} from '../../symbols/dashboard-token-rcp-responce.symbols';
import {UmiPublicKey} from '../../symbols/dashboard-token-resolve-non-compatible-types.symbols';
import {JsonUrlTokenAccountPair, MetadataJsonFieldsTokenAccountPair} from '../../symbols/dashboard-token-metadata-retrieval.symbols';
import {RtSolanaService} from '../../../rt-solana/services/rt-solana/rt-solana.service';
import {MetadataJsonFields} from '../../../rt-solana/symbols';

@Injectable()
export class DashboardTokenListService {
  /**
   * Connection to the current Solana network cluster.
   */
  public readonly currentClusterConnection = this.rtSolana.currentClusterConnection;

  constructor(
    private http: HttpClient,
    private rtSolana: RtSolanaService,
  ) {}

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
   * Load the list of token metadata by their mint accounts.
   * @param metadataAccounts - The address list of Metaplex token metadata accounts.
   */
  public loadListTokenMetadata(metadataAccounts: UmiPublicKey[]): Promise<Metadata[]> {
    // Get a new UMI instance for the current network cluster.
    const umi = this.rtSolana.getNewUmiInstance();

    // Update the UMI instance with the current RPC URL and the Metaplex token metadata plugin.
    umi.use(mplTokenMetadata()).use(walletAdapterIdentity(this.rtSolana.currentWalletAdapter));

    // Fetch the metadata.
    return safeFetchAllMetadata(umi, metadataAccounts);
  }

  /**
   * Load the list of token metadata JSON files by their URLs.
   * @param jsonUrlTokenAccountPairs - The list of JSON URL and token account pairs.
   */
  public loadListTokenMetadataJsonByUrl(
    jsonUrlTokenAccountPairs: JsonUrlTokenAccountPair[],
  ): Observable<MetadataJsonFieldsTokenAccountPair[]> {
    const loadRequests = jsonUrlTokenAccountPairs.map(pairData =>
      this.http.get<MetadataJsonFields>(pairData.jsonUrl).pipe(
        // Provide an empty value in case of an error to avoid breaking the whole forkJoin request.
        catchError(() => of(null)),

        // Map the JSON metadata to the token account.
        map(jsonMetadata => ({jsonMetadata, tokenAccount: pairData.tokenAccount})),
      ),
    );

    // Load all JSON metadata and return the result.
    return forkJoin(loadRequests).pipe(
      // Remove all items with no JSON metadata.
      map(data => data.filter(item => !!item?.jsonMetadata) as MetadataJsonFieldsTokenAccountPair[]),
    );
  }
}
