import {Injectable} from '@angular/core';
import {Action, Selector, State, StateContext} from '@ngxs/store';
import {Metadata} from '@metaplex-foundation/mpl-token-metadata/dist/src/generated/accounts/metadata';
import {
  LoadTokenList,
  LoadTokenListFail,
  LoadTokenListMetadata,
  LoadTokenListMetadataJson,
  LoadTokenListSuccess,
} from './dashboard-token-list.actions';
import {dashboardTokenListStateId, DashboardTokenListStateModel, defaultDashboardTokenState} from './dashboard-token-list.model';
import {JsonUrlTokenAccountPair, MetadataJsonFieldsTokenAccountPair} from '../../symbols/dashboard-token-metadata-retrieval.symbols';
import {DashboardTokenListService} from '../../services/dashboard-token-list/dashboard-token-list.service';
import {toUmiPublicKey} from '../../symbols/dashboard-token-resolve-non-compatible-types.symbols';
import {progressStatuses} from '../../../shared/symbols/statuses.symbols';
import {RtSolanaService} from '../../../rt-solana/services/rt-solana/rt-solana.service';
import {PiledTokenData} from '../../../rt-solana/symbols';

@State<DashboardTokenListStateModel>({
  name: dashboardTokenListStateId,
  defaults: defaultDashboardTokenState,
})
@Injectable()
export class DashboardTokenListState {
  constructor(
    private dashboardTokenList: DashboardTokenListService,
    private rtSolana: RtSolanaService,
  ) {}

  @Selector()
  static loadTokenListProcess(state: DashboardTokenListStateModel): DashboardTokenListStateModel['loadTokenListProcess'] {
    return state.loadTokenListProcess;
  }

  @Selector()
  static tokenListPiledData(state: DashboardTokenListStateModel): DashboardTokenListStateModel['tokenListPiledData'] {
    return state.tokenListPiledData;
  }

  @Selector()
  static lastLoadTokenListError(state: DashboardTokenListStateModel): DashboardTokenListStateModel['lastLoadTokenListError'] {
    return state.lastLoadTokenListError;
  }

  @Action(LoadTokenList)
  loadTokenList(ctx: StateContext<DashboardTokenListStateModel>, {publicKey}: LoadTokenList): void {
    ctx.patchState({
      loadTokenListProcess: progressStatuses.inProgress,
      lastLoadTokenListError: null,
    });

    this.dashboardTokenList
      .loadAllAccountTokens(publicKey)
      .then(data => ctx.dispatch(new LoadTokenListMetadata(data)))
      .catch(error => ctx.dispatch(new LoadTokenListFail(error)));
  }

  @Action(LoadTokenListMetadata)
  loadTokenListMetadata(ctx: StateContext<DashboardTokenListStateModel>, {tokenListContext}: LoadTokenListMetadata): void {
    // Generate the piled token data.
    const tokenListPiledData: PiledTokenData[] = tokenListContext.value.map(account => ({
      tokenAccount: account?.pubkey.toString(),
      metadataAccountAddress: this.rtSolana
        .getMetaplexMetadataAccountAddressByMint(account?.account?.data?.parsed?.info?.mint)[0]
        .toString(),
      tokenDetails: account,
    }));

    // Update the state with the token list context and the piled token data.
    ctx.patchState({
      loadTokenListProcess: progressStatuses.inProgress,
      tokenList: tokenListContext.value,
      tokenListPiledData,
    });

    // Extract the metadata accounts from the piled token data.
    const metadataAccounts = tokenListPiledData.map(piledTokenData => toUmiPublicKey(piledTokenData.metadataAccountAddress));

    // Load the token metadata for each mint account.
    this.dashboardTokenList
      .loadListTokenMetadata(metadataAccounts)
      .then(tokenMetadataList => ctx.dispatch(new LoadTokenListMetadataJson(tokenMetadataList)))
      .catch(error => ctx.dispatch(new LoadTokenListFail(error)));
  }

  @Action(LoadTokenListMetadataJson)
  loadTokenListMetadataJson(ctx: StateContext<DashboardTokenListStateModel>, {tokenListMetadata}: LoadTokenListMetadataJson): void {
    // Extract the piled token data from the state.
    const tokenListPiledData: PiledTokenData[] = ctx.getState().tokenListPiledData;

    // Transform the token list metadata into a map for easier access.
    const mappedTokenListMetadata = new Map<PublicKeyString, Metadata>();
    for (const metadata of tokenListMetadata) {
      mappedTokenListMetadata.set(metadata.publicKey.toString(), metadata);
    }

    // Merge the token list piled data with the token list metadata.
    const updatedTokenListPiledData: PiledTokenData[] = tokenListPiledData.map(piledTokenData => ({
      ...piledTokenData,
      metaplexMetadata: mappedTokenListMetadata.get(piledTokenData.metadataAccountAddress) as Metadata,
    }));

    // Update the state with the token list metadata and the updated piled token data.
    ctx.patchState({
      loadTokenListProcess: progressStatuses.succeed,
      tokenListMetadata,
      tokenListPiledData: updatedTokenListPiledData,
    });

    const jsonUrlTokenAccountPair: JsonUrlTokenAccountPair[] = updatedTokenListPiledData
      // Remove the piled data without the token metadata.
      .filter(piledData => !!piledData?.metaplexMetadata?.uri)
      // Map the piled data to the JSON URL and the token account.
      .map(piledData => ({
        jsonUrl: piledData?.metaplexMetadata?.uri as string,
        tokenAccount: piledData.tokenAccount,
      }));

    // Load the token metadata for each mint account.
    this.dashboardTokenList.loadListTokenMetadataJsonByUrl(jsonUrlTokenAccountPair).subscribe({
      next: tokenMetadataListJson => ctx.dispatch(new LoadTokenListSuccess(tokenMetadataListJson)),
      error: error => ctx.dispatch(new LoadTokenListFail(error)),
    });
  }

  @Action(LoadTokenListSuccess)
  loadTokenListSuccess(ctx: StateContext<DashboardTokenListStateModel>, {tokenListMetadataJson}: LoadTokenListSuccess): void {
    // Extract the piled token data from the state.
    const tokenListPiledData: PiledTokenData[] = ctx.getState().tokenListPiledData;

    // Transform the token list metadata JSON into a map for easier access.
    const mappedTokenListMetadataJson = new Map<MetadataJsonFieldsTokenAccountPair['tokenAccount'], MetadataJsonFieldsTokenAccountPair>();
    for (const metadataJson of tokenListMetadataJson) {
      mappedTokenListMetadataJson.set(metadataJson.tokenAccount, metadataJson);
    }

    // Merge the token list piled data with the token list metadata JSON.
    const updatedTokenListPiledData: PiledTokenData[] = tokenListPiledData.map(piledData => ({
      ...piledData,
      jsonMetadata: mappedTokenListMetadataJson.get(piledData.tokenAccount)?.jsonMetadata,
    }));

    // Update the state with the token list metadata JSON and the updated piled token data.
    ctx.patchState({
      loadTokenListProcess: progressStatuses.succeed,
      tokenListMetadataJson,
      tokenListPiledData: updatedTokenListPiledData,
    });
  }

  @Action(LoadTokenListFail)
  loadTokenListFail(ctx: StateContext<DashboardTokenListStateModel>, {error}: LoadTokenListFail): void {
    ctx.patchState({
      loadTokenListProcess: progressStatuses.interrupted,
      lastLoadTokenListError: error,
    });
  }
}
