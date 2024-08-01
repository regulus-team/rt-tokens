import {switchMap} from 'rxjs';
import {Injectable} from '@angular/core';
import {Action, Selector, State, StateContext} from '@ngxs/store';
import {PublicKey} from '@solana/web3.js';
import {
  CreateFungibleToken,
  CreateFungibleTokenFail,
  CreateFungibleTokenSuccess,
  LoadAssociatedTokenAccount,
  LoadMetadataTokenAccount,
  LoadMetadataTokenJson,
  LoadTokenDetails,
  LoadTokenDetailsFail,
  LoadTokenDetailsSuccess,
  MintToken,
  MintTokenFail,
  MintTokenSuccess,
  ReloadCurrentTokenDetails,
  ResetMintTokenProcess,
} from './dashboard-token-item.actions';
import {dashboardTokenItemStateId, DashboardTokenItemStateModel, defaultDashboardTokenItemState} from './dashboard-token-item.model';
import {DashboardTokenItemService} from '../../services/dashboard-token-item/dashboard-token-item.service';
import {tokenDetailsProgressStatuses} from '../../symbols/dashboard-token-general.symbols';
import {JsonUrlTokenAccountPair, MetadataJsonFieldsTokenAccountPair} from '../../symbols/dashboard-token-metadata-retrieval.symbols';
import {progressStatuses} from '../../../shared/symbols/statuses.symbols';
import {RtSolanaService} from '../../../rt-solana/services/rt-solana/rt-solana.service';
import {RtIpfsService} from '../../../rt-ipfs/services/rt-ipfs/rt-ipfs.service';
import {MetadataJsonFields, toUmiPublicKey} from '../../../rt-solana/symbols';

@State<DashboardTokenItemStateModel>({
  name: dashboardTokenItemStateId,
  defaults: defaultDashboardTokenItemState,
})
@Injectable()
export class DashboardTokenItemState {
  constructor(
    private dashboardTokenItem: DashboardTokenItemService,
    private rtSolana: RtSolanaService,
    private rtIpfs: RtIpfsService,
  ) {}

  @Selector()
  static loadTokenDetailsProcess(state: DashboardTokenItemStateModel): DashboardTokenItemStateModel['loadTokenDetailsProcess'] {
    return state.loadTokenDetailsProcess;
  }

  @Selector()
  static tokenAccount(state: DashboardTokenItemStateModel): DashboardTokenItemStateModel['tokenAccount'] {
    return state.tokenAccount;
  }

  @Selector()
  static associatedTokenAccount(state: DashboardTokenItemStateModel): DashboardTokenItemStateModel['associatedTokenAccount'] {
    return state.associatedTokenAccount;
  }

  @Selector()
  static tokenAmount(state: DashboardTokenItemStateModel): DashboardTokenItemStateModel['tokenAmount'] {
    return state.tokenAmount;
  }

  @Selector()
  static supply(state: DashboardTokenItemStateModel): DashboardTokenItemStateModel['supply'] {
    return state.supply;
  }

  @Selector()
  static tokenOwner(state: DashboardTokenItemStateModel): DashboardTokenItemStateModel['tokenOwner'] {
    return state.tokenOwner;
  }

  @Selector()
  static mintAuthority(state: DashboardTokenItemStateModel): DashboardTokenItemStateModel['mintAuthority'] {
    return state.mintAuthority;
  }

  @Selector()
  static freezeAuthority(state: DashboardTokenItemStateModel): DashboardTokenItemStateModel['freezeAuthority'] {
    return state.freezeAuthority;
  }

  @Selector()
  static tokenMetadata(state: DashboardTokenItemStateModel): DashboardTokenItemStateModel['tokenMetadata'] {
    return state.tokenMetadata;
  }

  @Selector()
  static tokenMetadataJson(state: DashboardTokenItemStateModel): DashboardTokenItemStateModel['tokenMetadataJson'] {
    return state.tokenMetadataJson;
  }

  @Selector()
  static lastLoadTokenDetailsError(state: DashboardTokenItemStateModel): DashboardTokenItemStateModel['lastLoadTokenDetailsError'] {
    return state.lastLoadTokenDetailsError;
  }

  @Selector()
  static mintTokenProcess(state: DashboardTokenItemStateModel): DashboardTokenItemStateModel['mintTokenProcess'] {
    return state.mintTokenProcess;
  }

  @Selector()
  static lastMintTokenError(state: DashboardTokenItemStateModel): DashboardTokenItemStateModel['lastMintTokenError'] {
    return state.lastMintTokenError;
  }

  @Action(ReloadCurrentTokenDetails)
  reloadCurrentTokenDetails(ctx: StateContext<DashboardTokenItemStateModel>): void {
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
  loadTokenDetails(ctx: StateContext<DashboardTokenItemStateModel>, {publicKey}: LoadTokenDetails): void {
    ctx.patchState({
      loadTokenDetailsProcess: tokenDetailsProgressStatuses.loadingTokenAccount,
      tokenAccount: publicKey,
      lastLoadTokenDetailsError: null,
    });

    this.dashboardTokenItem
      .loadTokenAccountData(publicKey)
      .then(tokenAccountData => ctx.dispatch(new LoadAssociatedTokenAccount(tokenAccountData)))
      .catch(error => ctx.dispatch(new LoadTokenDetailsFail(error)));
  }

  @Action(LoadAssociatedTokenAccount)
  loadAssociatedTokenAccount(ctx: StateContext<DashboardTokenItemStateModel>, {tokenAccountData}: LoadAssociatedTokenAccount): void {
    ctx.patchState({
      loadTokenDetailsProcess: tokenDetailsProgressStatuses.loadingAssociatedTokenAccount,
      associatedTokenAccount: new PublicKey(tokenAccountData.value.data.parsed.info.mint),
      tokenOwner: new PublicKey(tokenAccountData.value.data.parsed.info.owner),
      tokenAmount: tokenAccountData.value.data.parsed.info.tokenAmount,
    });

    const associatedTokenAccountPublicKey = new PublicKey(tokenAccountData.value.data.parsed.info.mint);
    this.dashboardTokenItem
      .loadAssociatedTokenAccountData(associatedTokenAccountPublicKey)
      .then(associatedTokenAccount => ctx.dispatch(new LoadMetadataTokenAccount(associatedTokenAccount)))
      .catch(error => ctx.dispatch(new LoadTokenDetailsFail(error)));
  }

  @Action(LoadMetadataTokenAccount)
  loadMetadataTokenAccount(ctx: StateContext<DashboardTokenItemStateModel>, {associatedTokenAccount}: LoadMetadataTokenAccount): void {
    ctx.patchState({
      loadTokenDetailsProcess: tokenDetailsProgressStatuses.loadingMetadataAccount,
      supply: associatedTokenAccount.value.data.parsed.info.supply,
      mintAuthority: new PublicKey(associatedTokenAccount.value.data.parsed.info.mintAuthority),
      freezeAuthority: new PublicKey(associatedTokenAccount.value.data.parsed.info.freezeAuthority),
    });

    // Get the metadata account address.
    const associatedAccountAddress = ctx.getState().associatedTokenAccount as PublicKey;
    const metadataAccountPda = this.rtSolana.getMetaplexMetadataAccountAddressByMint(toUmiPublicKey(associatedAccountAddress));
    const metadataAccount = metadataAccountPda[0];

    // Load the token metadata.
    this.dashboardTokenItem
      .loadTokenMetadata(metadataAccount)
      .then(metadata => ctx.dispatch(new LoadMetadataTokenJson(metadata)))
      .catch(error => ctx.dispatch(new LoadTokenDetailsFail(error)));
  }

  @Action(LoadMetadataTokenJson)
  loadMetadataTokenJson(ctx: StateContext<DashboardTokenItemStateModel>, {tokenMetadata}: LoadMetadataTokenJson): void {
    ctx.patchState({
      tokenMetadata,
      loadTokenDetailsProcess: tokenDetailsProgressStatuses.loadingMetadataJson,
    });

    // Select the associated token account.
    const associatedTokenAccount = ctx.getState().associatedTokenAccount as PublicKey;

    // If the token metadata is available, load the token metadata JSON.
    if (tokenMetadata?.uri) {
      const jsonUrlTokenAccountPair: JsonUrlTokenAccountPair = {
        jsonUrl: tokenMetadata.uri,
        tokenAccount: associatedTokenAccount.toString(),
      };
      this.dashboardTokenItem.loadTokenMetadataJsonByUrl(jsonUrlTokenAccountPair).subscribe({
        next: tokenMetadataJson => ctx.dispatch(new LoadTokenDetailsSuccess(tokenMetadataJson)),
        error: error => ctx.dispatch(new LoadTokenDetailsFail(error)),
      });
      // Otherwise, finish the process with a null JSON metadata.
    } else {
      const jsonUrlTokenAccountPair: MetadataJsonFieldsTokenAccountPair<Nullable<MetadataJsonFields>> = {
        jsonMetadata: null,
        tokenAccount: associatedTokenAccount.toString(),
      };
      ctx.dispatch(new LoadTokenDetailsSuccess(jsonUrlTokenAccountPair));
    }
  }

  @Action(LoadTokenDetailsSuccess)
  loadTokenDetailsSuccess(ctx: StateContext<DashboardTokenItemStateModel>, {tokenMetadataJson}: LoadTokenDetailsSuccess): void {
    ctx.patchState({
      tokenMetadataJson,
      loadTokenDetailsProcess: tokenDetailsProgressStatuses.succeed,
    });
  }

  @Action(LoadTokenDetailsFail)
  loadTokenDetailsFail(ctx: StateContext<DashboardTokenItemStateModel>, {error}: LoadTokenDetailsFail): void {
    ctx.patchState({
      loadTokenDetailsProcess: tokenDetailsProgressStatuses.interrupted,
      lastLoadTokenDetailsError: error,
    });
  }

  @Action(CreateFungibleToken)
  createFungibleToken(ctx: StateContext<DashboardTokenItemStateModel>, {tokenMetadata}: CreateFungibleToken): void {
    ctx.patchState({
      createTokenProcess: progressStatuses.inProgress,
      lastCreateTokenError: null,
    });

    this.rtIpfs
      .uploadTokenMetadata(tokenMetadata)
      .pipe(
        switchMap(tokenMetadataIpfsUrl =>
          this.dashboardTokenItem.createFungibleToken(tokenMetadata.name, tokenMetadata.decimals, tokenMetadataIpfsUrl),
        ),
      )
      .subscribe({
        next: () => ctx.dispatch(new CreateFungibleTokenSuccess()),
        error: error => ctx.dispatch(new CreateFungibleTokenFail(error)),
      });
  }

  @Action(CreateFungibleTokenSuccess)
  createFungibleTokenSuccess(ctx: StateContext<DashboardTokenItemStateModel>): void {
    ctx.patchState({
      createTokenProcess: progressStatuses.succeed,
    });
  }

  @Action(CreateFungibleTokenFail)
  createFungibleTokenFail(ctx: StateContext<DashboardTokenItemStateModel>, {error}: CreateFungibleTokenFail): void {
    ctx.patchState({
      createTokenProcess: progressStatuses.interrupted,
      lastCreateTokenError: error,
    });
  }

  @Action(MintToken)
  mintToken(ctx: StateContext<DashboardTokenItemStateModel>, {mintTokenData}: MintToken): void {
    ctx.patchState({
      mintTokenProcess: progressStatuses.inProgress,
      lastMintTokenError: null,
    });

    this.dashboardTokenItem
      .mintSpecificToken(mintTokenData)
      .then(signature => {
        ctx.dispatch(new MintTokenSuccess(signature, mintTokenData));
      })
      .catch(error => ctx.dispatch(new MintTokenFail(error)));
  }

  @Action(MintTokenSuccess)
  mintTokenSuccess(ctx: StateContext<DashboardTokenItemStateModel>, {transactionSignature, mintTokenData}: MintTokenSuccess): void {
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
  mintTokenFail(ctx: StateContext<DashboardTokenItemStateModel>, {error}: MintTokenFail): void {
    ctx.patchState({
      mintTokenProcess: progressStatuses.interrupted,
      lastMintTokenError: error,
    });
  }

  @Action(ResetMintTokenProcess)
  resetMintTokenProgress(ctx: StateContext<DashboardTokenItemStateModel>): void {
    ctx.patchState({
      mintTokenProcess: progressStatuses.notInitialized,
      lastMintTokenError: null,
    });
  }
}
