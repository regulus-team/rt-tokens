import {Injectable} from '@angular/core';
import {Action, Selector, State, StateContext} from '@ngxs/store';
import {PublicKey} from '@solana/web3.js';
import {
  LoadAssociatedTokenAccount,
  LoadMetadataTokenAccount,
  LoadMetadataTokenJson,
  LoadTokenDetails,
  LoadTokenDetailsFail,
  LoadTokenDetailsSuccess,
  ReloadCurrentTokenDetails,
} from './dashboard-token-item.actions';
import {dashboardTokenItemStateId, DashboardTokenItemStateModel, defaultDashboardTokenItemState} from './dashboard-token-item.model';
import {DashboardTokenItemService} from '../../services/dashboard-token-item/dashboard-token-item.service';
import {JsonUrlTokenAccountPair, MetadataJsonFieldsTokenAccountPair} from '../../symbols/dashboard-token-metadata-retrieval.symbols';
import {RtSolanaService} from '../../../rt-solana/services/rt-solana/rt-solana.service';
import {MetadataJsonFields, toUmiPublicKey} from '../../../rt-solana/symbols';
import {progressStatuses} from '../../../shared/symbols/statuses.symbols';

@State<DashboardTokenItemStateModel>({
  name: dashboardTokenItemStateId,
  defaults: defaultDashboardTokenItemState,
})
@Injectable()
export class DashboardTokenItemState {
  constructor(
    private dashboardTokenItem: DashboardTokenItemService,
    private rtSolana: RtSolanaService,
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
  static tokenState(state: DashboardTokenItemStateModel): DashboardTokenItemStateModel['tokenState'] {
    return state.tokenState;
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
      loadTokenDetailsProcess: progressStatuses.inProgress,
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
      loadTokenDetailsProcess: progressStatuses.inProgress,
      associatedTokenAccount: new PublicKey(tokenAccountData.value.data.parsed.info.mint),
      tokenOwner: new PublicKey(tokenAccountData.value.data.parsed.info.owner),
      tokenAmount: tokenAccountData.value.data.parsed.info.tokenAmount,
      tokenState: tokenAccountData.value.data.parsed.info.state,
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
      loadTokenDetailsProcess: progressStatuses.inProgress,
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
      loadTokenDetailsProcess: progressStatuses.inProgress,
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
      loadTokenDetailsProcess: progressStatuses.succeed,
    });
  }

  @Action(LoadTokenDetailsFail)
  loadTokenDetailsFail(ctx: StateContext<DashboardTokenItemStateModel>, {error}: LoadTokenDetailsFail): void {
    ctx.patchState({
      loadTokenDetailsProcess: progressStatuses.interrupted,
      lastLoadTokenDetailsError: error,
    });
  }
}
