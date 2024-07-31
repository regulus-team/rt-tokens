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
  MintToken,
  MintTokenFail,
  MintTokenSuccess,
  ReloadCurrentTokenDetails,
  ResetMintTokenProcess,
} from './dashboard-token-item.actions';
import {dashboardTokenItemStateId, DashboardTokenItemStateModel, defaultDashboardTokenItemState} from './dashboard-token-item.model';
import {DashboardTokenService} from '../../services/dashboard-token/dashboard-token.service';
import {tokenDetailsProgressStatuses} from '../../symbols/dashboard-token-general.symbols';
import {progressStatuses} from '../../../shared/symbols/statuses.symbols';
import {RtSolanaService} from '../../../rt-solana/services/rt-solana/rt-solana.service';
import {RtIpfsService} from '../../../rt-ipfs/services/rt-ipfs/rt-ipfs.service';

@State<DashboardTokenItemStateModel>({
  name: dashboardTokenItemStateId,
  defaults: defaultDashboardTokenItemState,
})
@Injectable()
export class DashboardTokenItemState {
  constructor(
    private dashboardToken: DashboardTokenService,
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
  static mintAuthority(state: DashboardTokenItemStateModel): DashboardTokenItemStateModel['mintAuthority'] {
    return state.mintAuthority;
  }

  @Selector()
  static freezeAuthority(state: DashboardTokenItemStateModel): DashboardTokenItemStateModel['freezeAuthority'] {
    return state.freezeAuthority;
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

    this.dashboardToken
      .loadTokenAccountData(publicKey)
      .then(tokenAccountData => ctx.dispatch(new LoadAssociatedTokenAccount(tokenAccountData)))
      .catch(error => ctx.dispatch(new LoadTokenDetailsFail(error)));
  }

  @Action(LoadAssociatedTokenAccount)
  loadAssociatedTokenAccount(ctx: StateContext<DashboardTokenItemStateModel>, {tokenAccountData}: LoadAssociatedTokenAccount): void {
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
  loadTokenDetailsSuccess(ctx: StateContext<DashboardTokenItemStateModel>, {associatedTokenAccount}: LoadTokenDetailsSuccess): void {
    ctx.patchState({
      loadTokenDetailsProcess: tokenDetailsProgressStatuses.succeed,
      supply: associatedTokenAccount.value.data.parsed.info.supply,
      mintAuthority: new PublicKey(associatedTokenAccount.value.data.parsed.info.mintAuthority),
      freezeAuthority: new PublicKey(associatedTokenAccount.value.data.parsed.info.freezeAuthority),
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
          this.dashboardToken.createFungibleToken(tokenMetadata.name, tokenMetadata.decimals, tokenMetadataIpfsUrl),
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

    this.dashboardToken
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
