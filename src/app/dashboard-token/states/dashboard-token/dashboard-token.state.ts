import {Injectable} from '@angular/core';
import {Action, Selector, State, StateContext} from '@ngxs/store';
import {
  LoadAssociatedTokenAccount,
  LoadTokenDetails,
  LoadTokenDetailsFail,
  LoadTokenDetailsSuccess,
  LoadTokenList,
  LoadTokenListFail,
  LoadTokenListSuccess,
  ReloadCurrentTokenDetails,
} from './dashboard-token.actions';
import {dashboardTokenStateId, DashboardTokenStateModel, defaultDashboardTokenState} from './dashboard-token.model';
import {DashboardTokenService} from '../../services/dashboard-token/dashboard-token.service';
import {progressStatuses} from '../../../shared/symbols/statuses.symbols';
import {tokenDetailsProgressStatuses} from '../../symbols';
import {PublicKey} from '@solana/web3.js';

@State<DashboardTokenStateModel>({
  name: dashboardTokenStateId,
  defaults: defaultDashboardTokenState,
})
@Injectable()
export class DashboardTokenState {
  constructor(private dashboardToken: DashboardTokenService) {}

  @Selector()
  static loadTokenListProcess(state: DashboardTokenStateModel): DashboardTokenStateModel['loadTokenListProcess'] {
    return state.loadTokenListProcess;
  }

  @Selector()
  static tokenList(state: DashboardTokenStateModel): DashboardTokenStateModel['tokenList'] {
    return state.tokenList;
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

  @Action(LoadTokenList)
  loadTokenList(ctx: StateContext<DashboardTokenStateModel>, {publicKey}: LoadTokenList): void {
    ctx.patchState({
      loadTokenListProcess: progressStatuses.inProgress,
      lastLoadTokenListError: null,
    });

    this.dashboardToken
      .loadAllAccountTokens(publicKey)
      .then(data => ctx.dispatch(new LoadTokenListSuccess(data)))
      .catch(error => ctx.dispatch(new LoadTokenListFail(error)));
  }

  @Action(LoadTokenListSuccess)
  loadTokenListSuccess(ctx: StateContext<DashboardTokenStateModel>, {tokenListContext}: LoadTokenListSuccess): void {
    ctx.patchState({
      loadTokenListProcess: progressStatuses.succeed,
      tokenList: tokenListContext.value,
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
}
