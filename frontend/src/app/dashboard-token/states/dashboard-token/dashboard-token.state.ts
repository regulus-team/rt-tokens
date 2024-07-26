import {switchMap} from 'rxjs';
import {Injectable} from '@angular/core';
import {Action, Selector, State, StateContext} from '@ngxs/store';
import {PublicKey} from '@solana/web3.js';
import {
  CreateFungibleToken,
  CreateFungibleTokenFail,
  CreateFungibleTokenSuccess,
  LoadAssociatedTokenAccount,
  LoadTokenDetails,
  LoadTokenDetailsFail,
  LoadTokenDetailsSuccess,
  LoadTokenList,
  LoadTokenListFail,
  LoadTokenListMetadata,
  LoadTokenListMetadataJson,
  LoadTokenListSuccess,
  MintToken,
  MintTokenFail,
  MintTokenSuccess,
  ReloadCurrentTokenDetails,
  ResetMintTokenProcess,
} from './dashboard-token.actions';
import {dashboardTokenStateId, DashboardTokenStateModel, defaultDashboardTokenState} from './dashboard-token.model';
import {DashboardTokenService} from '../../services/dashboard-token/dashboard-token.service';
import {tokenDetailsProgressStatuses} from '../../symbols/dashboard-token-general.symbols';
import {progressStatuses} from '../../../shared/symbols/statuses.symbols';
import {RtSolanaService} from '../../../rt-solana/services/rt-solana/rt-solana.service';
import {RtIpfsService} from '../../../rt-ipfs/services/rt-ipfs/rt-ipfs.service';
import {PiledTokenData, solToUmiPublicKey} from '../../../rt-solana/symbols';
import {Metadata} from '@metaplex-foundation/mpl-token-metadata/dist/src/generated/accounts/metadata';
import {JsonUrlTokenAccountPair, MetadataJsonFieldsTokenAccountPair} from '../../symbols/dashboard-token-metadata-retrieval.symbols';

@State<DashboardTokenStateModel>({
  name: dashboardTokenStateId,
  defaults: defaultDashboardTokenState,
})
@Injectable()
export class DashboardTokenState {
  constructor(
    private dashboardToken: DashboardTokenService,
    private rtSolana: RtSolanaService,
    private rtIpfs: RtIpfsService,
  ) {}

  @Selector()
  static loadTokenListProcess(state: DashboardTokenStateModel): DashboardTokenStateModel['loadTokenListProcess'] {
    return state.loadTokenListProcess;
  }

  @Selector()
  static tokenListPiledData(state: DashboardTokenStateModel): DashboardTokenStateModel['tokenListPiledData'] {
    return state.tokenListPiledData;
  }

  @Selector()
  static lastLoadTokenListError(state: DashboardTokenStateModel): DashboardTokenStateModel['lastLoadTokenListError'] {
    return state.lastLoadTokenListError;
  }

  @Selector()
  static loadTokenDetailsProcess(state: DashboardTokenStateModel): DashboardTokenStateModel['loadTokenDetailsProcess'] {
    return state.loadTokenDetailsProcess;
  }

  @Selector()
  static tokenAccount(state: DashboardTokenStateModel): DashboardTokenStateModel['tokenAccount'] {
    return state.tokenAccount;
  }

  @Selector()
  static associatedTokenAccount(state: DashboardTokenStateModel): DashboardTokenStateModel['associatedTokenAccount'] {
    return state.associatedTokenAccount;
  }

  @Selector()
  static tokenAmount(state: DashboardTokenStateModel): DashboardTokenStateModel['tokenAmount'] {
    return state.tokenAmount;
  }

  @Selector()
  static supply(state: DashboardTokenStateModel): DashboardTokenStateModel['supply'] {
    return state.supply;
  }

  @Selector()
  static mintAuthority(state: DashboardTokenStateModel): DashboardTokenStateModel['mintAuthority'] {
    return state.mintAuthority;
  }

  @Selector()
  static freezeAuthority(state: DashboardTokenStateModel): DashboardTokenStateModel['freezeAuthority'] {
    return state.freezeAuthority;
  }

  @Selector()
  static lastLoadTokenDetailsError(state: DashboardTokenStateModel): DashboardTokenStateModel['lastLoadTokenDetailsError'] {
    return state.lastLoadTokenDetailsError;
  }

  @Selector()
  static mintTokenProcess(state: DashboardTokenStateModel): DashboardTokenStateModel['mintTokenProcess'] {
    return state.mintTokenProcess;
  }

  @Selector()
  static lastMintTokenError(state: DashboardTokenStateModel): DashboardTokenStateModel['lastMintTokenError'] {
    return state.lastMintTokenError;
  }

  @Action(LoadTokenList)
  loadTokenList(ctx: StateContext<DashboardTokenStateModel>, {publicKey}: LoadTokenList): void {
    ctx.patchState({
      loadTokenListProcess: progressStatuses.inProgress,
      lastLoadTokenListError: null,
    });

    this.dashboardToken
      .loadAllAccountTokens(publicKey)
      .then(data => ctx.dispatch(new LoadTokenListMetadata(data)))
      .catch(error => ctx.dispatch(new LoadTokenListFail(error)));
  }

  @Action(LoadTokenListMetadata)
  loadTokenListMetadata(ctx: StateContext<DashboardTokenStateModel>, {tokenListContext}: LoadTokenListMetadata): void {
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
    const metadataAccounts = tokenListPiledData.map(piledTokenData => solToUmiPublicKey(piledTokenData.metadataAccountAddress));

    // Load the token metadata for each mint account.
    this.dashboardToken
      .loadListTokenMetadata(metadataAccounts)
      .then(tokenMetadataList => ctx.dispatch(new LoadTokenListMetadataJson(tokenMetadataList)))
      .catch(error => ctx.dispatch(new LoadTokenListFail(error)));
  }

  @Action(LoadTokenListMetadataJson)
  loadTokenListMetadataJson(ctx: StateContext<DashboardTokenStateModel>, {tokenListMetadata}: LoadTokenListMetadataJson): void {
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
    this.dashboardToken.loadListTokenImageUrlByJsonUrl(jsonUrlTokenAccountPair).subscribe({
      next: tokenMetadataListJson => ctx.dispatch(new LoadTokenListSuccess(tokenMetadataListJson)),
      error: error => ctx.dispatch(new LoadTokenListFail(error)),
    });
  }

  @Action(LoadTokenListSuccess)
  loadTokenListSuccess(ctx: StateContext<DashboardTokenStateModel>, {tokenListMetadataJson}: LoadTokenListSuccess): void {
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
  loadTokenListFail(ctx: StateContext<DashboardTokenStateModel>, {error}: LoadTokenListFail): void {
    ctx.patchState({
      loadTokenListProcess: progressStatuses.interrupted,
      lastLoadTokenListError: error,
    });
  }

  @Action(ReloadCurrentTokenDetails)
  reloadCurrentTokenDetails(ctx: StateContext<DashboardTokenStateModel>): void {
    // Get the current token account.
    const currentTokenAccount = ctx.getState().tokenAccount;

    // Check if the token account is selected.
    if (!currentTokenAccount) {
      throw new Error('Token details cannot be reloaded as no token account is selected.');
    }

    // Load the token details.
    ctx.dispatch(new LoadTokenDetails(currentTokenAccount));
  }

  @Action(LoadTokenDetails)
  loadTokenDetails(ctx: StateContext<DashboardTokenStateModel>, {publicKey}: LoadTokenDetails): void {
    ctx.patchState({
      loadTokenDetailsProcess: tokenDetailsProgressStatuses.loadingTokenAccount,
      tokenAccount: publicKey,
      lastLoadTokenDetailsError: null,
    });

    this.dashboardToken
      .loadTokenAccountData(publicKey)
      .then(tokenAccountData => ctx.dispatch(new LoadAssociatedTokenAccount(tokenAccountData)))
      .catch(error => ctx.dispatch(new LoadTokenDetailsFail(error)));
  }

  @Action(LoadAssociatedTokenAccount)
  loadAssociatedTokenAccount(ctx: StateContext<DashboardTokenStateModel>, {tokenAccountData}: LoadAssociatedTokenAccount): void {
    ctx.patchState({
      loadTokenDetailsProcess: tokenDetailsProgressStatuses.loadingAssociatedTokenAccount,
      associatedTokenAccount: new PublicKey(tokenAccountData.value.data.parsed.info.mint),
      tokenAmount: tokenAccountData.value.data.parsed.info.tokenAmount,
    });

    const associatedTokenAccountPublicKey = new PublicKey(tokenAccountData.value.data.parsed.info.mint);
    this.dashboardToken
      .loadAssociatedTokenAccountData(associatedTokenAccountPublicKey)
      .then(associatedTokenAccount => ctx.dispatch(new LoadTokenDetailsSuccess(associatedTokenAccount)))
      .catch(error => ctx.dispatch(new LoadTokenDetailsFail(error)));
  }

  @Action(LoadTokenDetailsSuccess)
  loadTokenDetailsSuccess(ctx: StateContext<DashboardTokenStateModel>, {associatedTokenAccount}: LoadTokenDetailsSuccess): void {
    ctx.patchState({
      loadTokenDetailsProcess: tokenDetailsProgressStatuses.succeed,
      supply: associatedTokenAccount.value.data.parsed.info.supply,
      mintAuthority: new PublicKey(associatedTokenAccount.value.data.parsed.info.mintAuthority),
      freezeAuthority: new PublicKey(associatedTokenAccount.value.data.parsed.info.freezeAuthority),
    });
  }

  @Action(LoadTokenDetailsFail)
  loadTokenDetailsFail(ctx: StateContext<DashboardTokenStateModel>, {error}: LoadTokenDetailsFail): void {
    ctx.patchState({
      loadTokenDetailsProcess: tokenDetailsProgressStatuses.interrupted,
      lastLoadTokenDetailsError: error,
    });
  }

  @Action(CreateFungibleToken)
  createFungibleToken(ctx: StateContext<DashboardTokenStateModel>, {tokenMetadata}: CreateFungibleToken): void {
    ctx.patchState({
      createTokenProcess: progressStatuses.inProgress,
      lastCreateTokenError: null,
    });

    this.rtIpfs
      .uploadTokenMetadata(tokenMetadata)
      .pipe(
        switchMap(tokenMetadataIpfsUrl =>
          this.dashboardToken.createFungibleToken(tokenMetadata.name, tokenMetadata.decimals, tokenMetadataIpfsUrl),
        ),
      )
      .subscribe({
        next: () => ctx.dispatch(new CreateFungibleTokenSuccess()),
        error: error => ctx.dispatch(new CreateFungibleTokenFail(error)),
      });
  }

  @Action(CreateFungibleTokenSuccess)
  createFungibleTokenSuccess(ctx: StateContext<DashboardTokenStateModel>): void {
    ctx.patchState({
      createTokenProcess: progressStatuses.succeed,
    });
  }

  @Action(CreateFungibleTokenFail)
  createFungibleTokenFail(ctx: StateContext<DashboardTokenStateModel>, {error}: CreateFungibleTokenFail): void {
    ctx.patchState({
      createTokenProcess: progressStatuses.interrupted,
      lastCreateTokenError: error,
    });
  }

  @Action(MintToken)
  mintToken(ctx: StateContext<DashboardTokenStateModel>, {mintTokenData}: MintToken): void {
    ctx.patchState({
      mintTokenProcess: progressStatuses.inProgress,
      lastMintTokenError: null,
    });

    this.dashboardToken
      .mintSpecificToken(mintTokenData)
      .then(signature => {
        ctx.dispatch(new MintTokenSuccess(signature, mintTokenData));
      })
      .catch(error => ctx.dispatch(new MintTokenFail(error)));
  }

  @Action(MintTokenSuccess)
  mintTokenSuccess(ctx: StateContext<DashboardTokenStateModel>, {transactionSignature, mintTokenData}: MintTokenSuccess): void {
    const storedTokenAccount = ctx.getState().tokenAccount;

    // Reload current token details if the minted token is the currently selected token.
    if (storedTokenAccount?.equals(mintTokenData.tokenAccountPublicKey)) {
      this.rtSolana.waitForTransactionBySignature(transactionSignature).then(isConfirmed => {
        if (isConfirmed) {
          ctx.dispatch(new ReloadCurrentTokenDetails());
        }
      });
    }

    ctx.patchState({
      mintTokenProcess: progressStatuses.succeed,
    });
  }

  @Action(MintTokenFail)
  mintTokenFail(ctx: StateContext<DashboardTokenStateModel>, {error}: MintTokenFail): void {
    ctx.patchState({
      mintTokenProcess: progressStatuses.interrupted,
      lastMintTokenError: error,
    });
  }

  @Action(ResetMintTokenProcess)
  resetMintTokenProgress(ctx: StateContext<DashboardTokenStateModel>): void {
    ctx.patchState({
      mintTokenProcess: progressStatuses.notInitialized,
      lastMintTokenError: null,
    });
  }
}
