import {Injectable} from '@angular/core';
import {Action, Selector, State, StateContext} from '@ngxs/store';
import {LoadTokenList, LoadTokenListFail, LoadTokenListSuccess} from './dashboard-token.actions';
import {dashboardTokenStateId, DashboardTokenStateModel, defaultDashboardTokenState} from './dashboard-token.model';
import {DashboardTokenService} from '../../services/dashboard-token/dashboard-token.service';
import {progressStatuses} from '../../../shared/symbols/statuses.symbols';

@State<DashboardTokenStateModel>({
  name: dashboardTokenStateId,
  defaults: defaultDashboardTokenState,
})
@Injectable()
export class DashboardTokenState {
  constructor(private dashboardToken: DashboardTokenService) {
  }

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

  @Action(LoadTokenList)
  loadTokenList(ctx: StateContext<DashboardTokenStateModel>, {publicKeyString}: LoadTokenList): void {
    ctx.patchState({
      loadTokenListProcess: progressStatuses.inProgress,
      lastLoadTokenListError: null,
    });

    this.dashboardToken.loadAllAccountTokens(publicKeyString).subscribe({
      next: (data) => ctx.dispatch(new LoadTokenListSuccess(data)),
      error: (error) => ctx.dispatch(new LoadTokenListFail(error)),
    });
  }

  @Action(LoadTokenListSuccess)
  loadTokenListSuccess(ctx: StateContext<DashboardTokenStateModel>, {tokenList}: LoadTokenListSuccess): void {
    ctx.patchState({
      loadTokenListProcess: progressStatuses.succeed,
      tokenList,
    });
  }

  @Action(LoadTokenListFail)
  loadTokenListFail(ctx: StateContext<DashboardTokenStateModel>, {error}: LoadTokenListFail): void {
    ctx.patchState({
      loadTokenListProcess: progressStatuses.interrupted,
      lastLoadTokenListError: error,
    });
  }
}
