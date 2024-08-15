import {switchMap} from 'rxjs';
import {Injectable} from '@angular/core';
import {Action, Selector, State, StateContext, Store} from '@ngxs/store';
import {
  BurnToken,
  BurnTokenFail,
  BurnTokenSuccess,
  CreateFungibleToken,
  CreateFungibleTokenFail,
  CreateFungibleTokenSuccess,
  FreezeToken,
  FreezeTokenFail,
  FreezeTokenSuccess,
  MintToken,
  MintTokenFail,
  MintTokenSuccess,
  ResetBurnTokenProcess,
  ResetMintTokenProcess,
  ResetTransferTokenProcess,
  ThawToken,
  ThawTokenFail,
  ThawTokenSuccess,
  TransferToken,
  TransferTokenFail,
  TransferTokenSuccess,
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
  static transferTokenProcess(state: DashboardTokenItemActionsStateModel): DashboardTokenItemActionsStateModel['transferTokenProcess'] {
    return state.transferTokenProcess;
  }

  @Selector()
  static lastTransferTokenError(state: DashboardTokenItemActionsStateModel): DashboardTokenItemActionsStateModel['lastTransferTokenError'] {
    return state.lastTransferTokenError;
  }

  @Selector()
  static burnTokenProcess(state: DashboardTokenItemActionsStateModel): DashboardTokenItemActionsStateModel['burnTokenProcess'] {
    return state.burnTokenProcess;
  }

  @Selector()
  static lastBurnTokenError(state: DashboardTokenItemActionsStateModel): DashboardTokenItemActionsStateModel['lastBurnTokenError'] {
    return state.lastBurnTokenError;
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

  @Action(TransferToken)
  transferToken(ctx: StateContext<DashboardTokenItemActionsStateModel>, {transferTokenData}: TransferToken): void {
    ctx.patchState({
      transferTokenProcess: progressStatuses.inProgress,
      lastTransferTokenError: null,
    });

    this.dashboardTokenItemActions
      .transferSpecificToken(transferTokenData)
      .then(result => {
        ctx.dispatch(new TransferTokenSuccess(result.signature.toString(), transferTokenData));
      })
      .catch(error => ctx.dispatch(new TransferTokenFail(error)));
  }

  @Action(TransferTokenSuccess)
  transferTokenSuccess(
    ctx: StateContext<DashboardTokenItemActionsStateModel>,
    {transactionSignature, transferTokenData}: TransferTokenSuccess,
  ): void {
    const associatedTokenAccount = this.store.selectSnapshot(DashboardTokenItemState.associatedTokenAccount);

    // Reload current token details if the transferred token is the currently selected token.
    if (associatedTokenAccount?.equals(transferTokenData.mint)) {
      this.rtSolana.waitForTransactionBySignature(transactionSignature).then(isConfirmed => {
        if (isConfirmed) {
          ctx.dispatch(new ReloadCurrentTokenDetails());
        }
      });
    }

    ctx.patchState({
      transferTokenProcess: progressStatuses.succeed,
    });
  }

  @Action(TransferTokenFail)
  transferTokenFail(ctx: StateContext<DashboardTokenItemActionsStateModel>, {error}: TransferTokenFail): void {
    ctx.patchState({
      transferTokenProcess: progressStatuses.interrupted,
      lastTransferTokenError: error,
    });
  }

  @Action(ResetTransferTokenProcess)
  resetTransferTokenProcess(ctx: StateContext<DashboardTokenItemActionsStateModel>): void {
    ctx.patchState({
      transferTokenProcess: progressStatuses.notInitialized,
      lastTransferTokenError: null,
    });
  }

  @Action(BurnToken)
  burnToken(ctx: StateContext<DashboardTokenItemActionsStateModel>, {burnTokenData}: BurnToken): void {
    ctx.patchState({
      burnTokenProcess: progressStatuses.inProgress,
      lastBurnTokenError: null,
    });

    this.dashboardTokenItemActions
      .burnSpecificToken(burnTokenData)
      .then(signature => {
        ctx.dispatch(new BurnTokenSuccess(signature, burnTokenData));
      })
      .catch(error => ctx.dispatch(new BurnTokenFail(error)));
  }

  @Action(BurnTokenSuccess)
  burnTokenSuccess(ctx: StateContext<DashboardTokenItemActionsStateModel>, {transactionSignature, burnTokenData}: BurnTokenSuccess): void {
    const storedTokenAccount = this.store.selectSnapshot(DashboardTokenItemState.tokenAccount);

    // Reload current token details if the burned token is the currently selected token.
    if (storedTokenAccount?.equals(burnTokenData.tokenAccountPublicKey)) {
      this.rtSolana.waitForTransactionBySignature(transactionSignature).then(isConfirmed => {
        if (isConfirmed) {
          ctx.dispatch(new ReloadCurrentTokenDetails());
        }
      });
    }

    ctx.patchState({
      burnTokenProcess: progressStatuses.succeed,
    });
  }

  @Action(BurnTokenFail)
  burnTokenFail(ctx: StateContext<DashboardTokenItemActionsStateModel>, {error}: BurnTokenFail): void {
    ctx.patchState({
      burnTokenProcess: progressStatuses.interrupted,
      lastBurnTokenError: error,
    });
  }

  @Action(ResetBurnTokenProcess)
  resetBurnTokenProcess(ctx: StateContext<DashboardTokenItemActionsStateModel>): void {
    ctx.patchState({
      burnTokenProcess: progressStatuses.notInitialized,
      lastBurnTokenError: null,
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
}
