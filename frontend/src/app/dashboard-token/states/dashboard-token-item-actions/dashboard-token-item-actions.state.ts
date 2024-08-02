import {switchMap} from 'rxjs';
import {Injectable} from '@angular/core';
import {Action, Selector, State, StateContext, Store} from '@ngxs/store';
import {
  CreateFungibleToken,
  CreateFungibleTokenFail,
  CreateFungibleTokenSuccess,
  FreezeToken,
  FreezeTokenFail,
  FreezeTokenSuccess,
  MintToken,
  MintTokenFail,
  MintTokenSuccess,
  ResetFreezeTokenProcess,
  ResetMintTokenProcess,
  ResetThawTokenProcess,
  ThawToken,
  ThawTokenFail,
  ThawTokenSuccess,
} from './dashboard-token-item-actions.actions';
import {
  dashboardTokenItemActionsStateId,
  DashboardTokenItemActionsStateModel,
  defaultDashboardTokenItemActionsState,
} from './dashboard-token-item-actions.model';
import {DashboardTokenItemState} from '../dashboard-token-item/dashboard-token-item.state';
import {ReloadCurrentTokenDetails} from '../dashboard-token-item/dashboard-token-item.actions';
import {DashboardTokenItemActionsService} from '../../services/dashboard-token-item-actions/dashboard-token-item-actions.service';
import {progressStatuses} from '../../../shared/symbols/statuses.symbols';
import {RtSolanaService} from '../../../rt-solana/services/rt-solana/rt-solana.service';
import {RtIpfsService} from '../../../rt-ipfs/services/rt-ipfs/rt-ipfs.service';

@State<DashboardTokenItemActionsStateModel>({
  name: dashboardTokenItemActionsStateId,
  defaults: defaultDashboardTokenItemActionsState,
})
@Injectable()
export class DashboardTokenItemActionsState {
  constructor(
    private store: Store,
    private dashboardTokenItemActions: DashboardTokenItemActionsService,
    private rtSolana: RtSolanaService,
    private rtIpfs: RtIpfsService,
  ) {}

  @Selector()
  static mintTokenProcess(state: DashboardTokenItemActionsStateModel): DashboardTokenItemActionsStateModel['mintTokenProcess'] {
    return state.mintTokenProcess;
  }

  @Selector()
  static lastMintTokenError(state: DashboardTokenItemActionsStateModel): DashboardTokenItemActionsStateModel['lastMintTokenError'] {
    return state.lastMintTokenError;
  }

  @Selector()
  static freezeTokenProcess(state: DashboardTokenItemActionsStateModel): DashboardTokenItemActionsStateModel['freezeTokenProcess'] {
    return state.freezeTokenProcess;
  }

  @Selector()
  static lastFreezeTokenError(state: DashboardTokenItemActionsStateModel): DashboardTokenItemActionsStateModel['lastFreezeTokenError'] {
    return state.lastFreezeTokenError;
  }

  @Selector()
  static thawTokenProcess(state: DashboardTokenItemActionsStateModel): DashboardTokenItemActionsStateModel['thawTokenProcess'] {
    return state.thawTokenProcess;
  }

  @Selector()
  static lastThawTokenError(state: DashboardTokenItemActionsStateModel): DashboardTokenItemActionsStateModel['lastThawTokenError'] {
    return state.lastThawTokenError;
  }

  @Action(CreateFungibleToken)
  createFungibleToken(ctx: StateContext<DashboardTokenItemActionsStateModel>, {tokenMetadata}: CreateFungibleToken): void {
    ctx.patchState({
      createTokenProcess: progressStatuses.inProgress,
      lastCreateTokenError: null,
    });

    this.rtIpfs
      .uploadTokenMetadata(tokenMetadata)
      .pipe(
        switchMap(tokenMetadataIpfsUrl =>
          this.dashboardTokenItemActions.createFungibleToken(tokenMetadata.name, tokenMetadata.decimals, tokenMetadataIpfsUrl),
        ),
      )
      .subscribe({
        next: () => ctx.dispatch(new CreateFungibleTokenSuccess()),
        error: error => ctx.dispatch(new CreateFungibleTokenFail(error)),
      });
  }

  @Action(CreateFungibleTokenSuccess)
  createFungibleTokenSuccess(ctx: StateContext<DashboardTokenItemActionsStateModel>): void {
    ctx.patchState({
      createTokenProcess: progressStatuses.succeed,
    });
  }

  @Action(CreateFungibleTokenFail)
  createFungibleTokenFail(ctx: StateContext<DashboardTokenItemActionsStateModel>, {error}: CreateFungibleTokenFail): void {
    ctx.patchState({
      createTokenProcess: progressStatuses.interrupted,
      lastCreateTokenError: error,
    });
  }

  @Action(MintToken)
  mintToken(ctx: StateContext<DashboardTokenItemActionsStateModel>, {mintTokenData}: MintToken): void {
    ctx.patchState({
      mintTokenProcess: progressStatuses.inProgress,
      lastMintTokenError: null,
    });

    this.dashboardTokenItemActions
      .mintSpecificToken(mintTokenData)
      .then(signature => {
        ctx.dispatch(new MintTokenSuccess(signature, mintTokenData));
      })
      .catch(error => ctx.dispatch(new MintTokenFail(error)));
  }

  @Action(MintTokenSuccess)
  mintTokenSuccess(ctx: StateContext<DashboardTokenItemActionsStateModel>, {transactionSignature, mintTokenData}: MintTokenSuccess): void {
    const storedTokenAccount = this.store.selectSnapshot(DashboardTokenItemState.tokenAccount);

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
  mintTokenFail(ctx: StateContext<DashboardTokenItemActionsStateModel>, {error}: MintTokenFail): void {
    ctx.patchState({
      mintTokenProcess: progressStatuses.interrupted,
      lastMintTokenError: error,
    });
  }

  @Action(ResetMintTokenProcess)
  resetMintTokenProgress(ctx: StateContext<DashboardTokenItemActionsStateModel>): void {
    ctx.patchState({
      mintTokenProcess: progressStatuses.notInitialized,
      lastMintTokenError: null,
    });
  }

  @Action(FreezeToken)
  freezeToken(ctx: StateContext<DashboardTokenItemActionsStateModel>, {freezeTokenData}: FreezeToken): void {
    ctx.patchState({
      freezeTokenProcess: progressStatuses.inProgress,
      lastFreezeTokenError: null,
    });

    this.dashboardTokenItemActions
      .freezeSpecificToken(freezeTokenData)
      .then(signature => {
        ctx.dispatch(new FreezeTokenSuccess(signature, freezeTokenData));
      })
      .catch(error => ctx.dispatch(new FreezeTokenFail(error)));
  }

  @Action(FreezeTokenSuccess)
  freezeTokenSuccess(
    ctx: StateContext<DashboardTokenItemActionsStateModel>,
    {transactionSignature, freezeTokenData}: FreezeTokenSuccess,
  ): void {
    const storedTokenAccount = this.store.selectSnapshot(DashboardTokenItemState.tokenAccount);

    // Reload current token details if the frozen token is the currently selected token.
    if (storedTokenAccount?.equals(freezeTokenData.tokenAccountPublicKey)) {
      this.rtSolana.waitForTransactionBySignature(transactionSignature).then(isConfirmed => {
        if (isConfirmed) {
          ctx.dispatch(new ReloadCurrentTokenDetails());
        }
      });
    }

    ctx.patchState({
      freezeTokenProcess: progressStatuses.succeed,
    });
  }

  @Action(FreezeTokenFail)
  freezeTokenFail(ctx: StateContext<DashboardTokenItemActionsStateModel>, {error}: FreezeTokenFail): void {
    ctx.patchState({
      freezeTokenProcess: progressStatuses.interrupted,
      lastFreezeTokenError: error,
    });
  }

  @Action(ResetFreezeTokenProcess)
  resetFreezeTokenProcess(ctx: StateContext<DashboardTokenItemActionsStateModel>): void {
    ctx.patchState({
      freezeTokenProcess: progressStatuses.notInitialized,
      lastFreezeTokenError: null,
    });
  }

  @Action(ThawToken)
  thawToken(ctx: StateContext<DashboardTokenItemActionsStateModel>, {thawTokenData}: ThawToken): void {
    ctx.patchState({
      thawTokenProcess: progressStatuses.inProgress,
      lastThawTokenError: null,
    });

    this.dashboardTokenItemActions
      .thawSpecificToken(thawTokenData)
      .then(signature => {
        ctx.dispatch(new ThawTokenSuccess(signature, thawTokenData));
      })
      .catch(error => ctx.dispatch(new ThawTokenFail(error)));
  }

  @Action(ThawTokenSuccess)
  thawTokenSuccess(ctx: StateContext<DashboardTokenItemActionsStateModel>, {transactionSignature, thawTokenData}: ThawTokenSuccess): void {
    const storedTokenAccount = this.store.selectSnapshot(DashboardTokenItemState.tokenAccount);

    // Reload current token details if the thawed token is the currently selected token.
    if (storedTokenAccount?.equals(thawTokenData.tokenAccountPublicKey)) {
      this.rtSolana.waitForTransactionBySignature(transactionSignature).then(isConfirmed => {
        if (isConfirmed) {
          ctx.dispatch(new ReloadCurrentTokenDetails());
        }
      });
    }

    ctx.patchState({
      thawTokenProcess: progressStatuses.succeed,
    });
  }

  @Action(ThawTokenFail)
  thawTokenFail(ctx: StateContext<DashboardTokenItemActionsStateModel>, {error}: ThawTokenFail): void {
    ctx.patchState({
      thawTokenProcess: progressStatuses.interrupted,
      lastThawTokenError: error,
    });
  }

  @Action(ResetThawTokenProcess)
  resetThawTokenProcess(ctx: StateContext<DashboardTokenItemActionsStateModel>): void {
    ctx.patchState({
      thawTokenProcess: progressStatuses.notInitialized,
      lastThawTokenError: null,
    });
  }
}
