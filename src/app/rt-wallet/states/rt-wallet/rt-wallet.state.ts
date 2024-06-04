import {Injectable} from '@angular/core';
import {Action, Selector, State, StateContext} from '@ngxs/store';
import {
  AirdropFail,
  AirdropSuccess,
  ConfirmAirdrop,
  ConnectWallet,
  ConnectWalletFail,
  ConnectWalletSuccess,
  GetWalletBalance,
  GetWalletBalanceFail,
  GetWalletBalanceSuccess,
  RequestAirdrop,
} from './rt-wallet.actions';
import {defaultRtWalletState, uniqueStateIdentifier, RtWalletStateModel} from './rt-wallet.model';
import {RtWalletService} from '../../services/rt-wallet/rt-wallet.service';
import {currentWalletAdapter} from '../../../shared/symbols/solana.symbols';
import {progressStatuses} from '../../../shared/symbols/statuses.symbols';

@State<RtWalletStateModel>({
  name: uniqueStateIdentifier,
  defaults: defaultRtWalletState,
})
@Injectable()
export class RtWalletState {
  constructor(private walletService: RtWalletService) {
  }

  @Selector()
  static connectWalletStatus(state: RtWalletStateModel): RtWalletStateModel['connectWalletStatus'] {
    return state.connectWalletStatus;
  }

  @Selector()
  static connectWalletError(state: RtWalletStateModel): RtWalletStateModel['connectWalletError'] {
    return state.connectWalletError;
  }

  @Selector()
  static loadBalanceStatus(state: RtWalletStateModel): RtWalletStateModel['loadBalanceStatus'] {
    return state.loadBalanceStatus;
  }

  @Selector()
  static currentBalance(state: RtWalletStateModel): RtWalletStateModel['currentBalance'] {
    return state.currentBalance;
  }

  @Selector()
  static updateBalanceStatus(state: RtWalletStateModel): RtWalletStateModel['updateBalanceStatus'] {
    return state.updateBalanceStatus;
  }

  @Selector()
  static loadBalanceError(state: RtWalletStateModel): RtWalletStateModel['loadBalanceError'] {
    return state.loadBalanceError;
  }

  @Selector()
  static updateBalanceError(state: RtWalletStateModel): RtWalletStateModel['updateBalanceError'] {
    return state.updateBalanceError;
  }

  @Action(ConnectWallet)
  connectWallet(ctx: StateContext<RtWalletStateModel>): void {
    ctx.patchState({
      connectWalletStatus: progressStatuses.inProgress,
      connectWalletError: null,
    });

    currentWalletAdapter.connect()
      .then(() => ctx.dispatch(new ConnectWalletSuccess()))
      .catch(error => ctx.dispatch(new ConnectWalletFail(error)));
  }

  @Action(ConnectWalletSuccess)
  connectWalletSuccess(ctx: StateContext<RtWalletStateModel>): void {
    ctx.patchState({
      connectWalletStatus: progressStatuses.succeed,
    });
  }

  @Action(ConnectWalletFail)
  connectWalletFail(ctx: StateContext<RtWalletStateModel>, {unknownError}: ConnectWalletFail): void {
    ctx.patchState({
      connectWalletStatus: progressStatuses.interrupted,
      connectWalletError: unknownError,
    });
  }

  @Action(GetWalletBalance)
  getWalletBalance(ctx: StateContext<RtWalletStateModel>, {publicKey}: GetWalletBalance): void {
    ctx.patchState({
      loadBalanceStatus: progressStatuses.inProgress,
      loadBalanceError: null,
    });

    this.walletService.getWalletBalance(publicKey)
      .then(balance => ctx.dispatch(new GetWalletBalanceSuccess(balance)))
      .catch(error => ctx.dispatch(new GetWalletBalanceFail(error)));
  }

  @Action(GetWalletBalanceSuccess)
  getWalletBalanceSuccess(ctx: StateContext<RtWalletStateModel>, {balance}: GetWalletBalanceSuccess): void {
    ctx.patchState({
      loadBalanceStatus: progressStatuses.succeed,
      currentBalance: balance,
    });
  }

  @Action(GetWalletBalanceFail)
  getWalletBalanceFail(ctx: StateContext<RtWalletStateModel>, {unknownError}: GetWalletBalanceFail): void {
    ctx.patchState({
      loadBalanceStatus: progressStatuses.interrupted,
      loadBalanceError: unknownError,
    });
  }

  @Action(RequestAirdrop)
  requestAirdrop(ctx: StateContext<RtWalletStateModel>, {publicKey, lamportsAmount}: RequestAirdrop): void {
    ctx.patchState({
      updateBalanceStatus: progressStatuses.inProgress,
      updateBalanceError: null,
    });

    this.walletService.requestAirdrop(publicKey, lamportsAmount)
      .then(transactionSignature => ctx.dispatch(new ConfirmAirdrop(transactionSignature, lamportsAmount)))
      .catch(error => ctx.dispatch(new AirdropFail(error)));
  }

  @Action(ConfirmAirdrop)
  confirmAirdrop(ctx: StateContext<RtWalletStateModel>, {transactionSignature, lamportsAmount}: ConfirmAirdrop): void {
    this.walletService.confirmAirdrop(transactionSignature)
      .then(() => ctx.dispatch(new AirdropSuccess(lamportsAmount)))
      .catch(error => ctx.dispatch(new AirdropFail(error)));
  }

  @Action(AirdropSuccess)
  airdropSuccess(ctx: StateContext<RtWalletStateModel>, {lamportsAmount}: AirdropSuccess): void {
    const state = ctx.getState();
    ctx.patchState({
      updateBalanceStatus: progressStatuses.succeed,
      currentBalance: state.currentBalance + lamportsAmount,
    });
  }

  @Action(AirdropFail)
  airdropFail(ctx: StateContext<RtWalletStateModel>, {unknownError}: AirdropFail): void {
    ctx.patchState({
      updateBalanceStatus: progressStatuses.interrupted,
      updateBalanceError: unknownError,
    });
  }
}
