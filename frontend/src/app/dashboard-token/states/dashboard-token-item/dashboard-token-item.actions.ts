import {AccountInfo, PublicKey, RpcResponseAndContext, TransactionSignature} from '@solana/web3.js';
import {dashboardTokenItemStateId} from './dashboard-token-item.model';
import {RpcResponseAssociatedTokenAccount, RpcResponseTokenAccount} from '../../symbols/dashboard-token-rcp-responce.symbols';
import {CreateFungibleTokenActionData, MintTokenActionData} from '../../symbols/dashboard-token-action-data.symbols';
import {UnknownError} from '../../../shared/symbols/errors.symbols';

export class ReloadCurrentTokenDetails {
  static type = `${dashboardTokenItemStateId} ${ReloadCurrentTokenDetails.name}`;
}

export class LoadTokenDetails {
  static type = `${dashboardTokenItemStateId} ${LoadTokenDetails.name}`;

  constructor(public publicKey: PublicKey) {}
}

export class LoadAssociatedTokenAccount {
  static type = `${dashboardTokenItemStateId} ${LoadAssociatedTokenAccount.name}`;

  constructor(public tokenAccountData: RpcResponseAndContext<AccountInfo<RpcResponseTokenAccount>>) {}
}

export class LoadTokenDetailsSuccess {
  static type = `${dashboardTokenItemStateId} ${LoadTokenDetailsSuccess.name}`;

  constructor(public associatedTokenAccount: RpcResponseAndContext<AccountInfo<RpcResponseAssociatedTokenAccount>>) {}
}

export class LoadTokenDetailsFail {
  static type = `${dashboardTokenItemStateId} ${LoadTokenDetailsFail.name}`;

  constructor(public error: UnknownError) {}
}

export class CreateFungibleToken {
  static type = `${dashboardTokenItemStateId} ${CreateFungibleToken.name}`;

  constructor(public tokenMetadata: CreateFungibleTokenActionData) {}
}

export class CreateFungibleTokenSuccess {
  static type = `${dashboardTokenItemStateId} ${CreateFungibleTokenSuccess.name}`;

  constructor() {}
}

export class CreateFungibleTokenFail {
  static type = `${dashboardTokenItemStateId} ${CreateFungibleTokenFail.name}`;

  constructor(public error: UnknownError) {}
}

export class MintToken {
  static type = `${dashboardTokenItemStateId} ${MintToken.name}`;

  constructor(public mintTokenData: MintTokenActionData) {}
}

export class MintTokenSuccess {
  static type = `${dashboardTokenItemStateId} ${MintTokenSuccess.name}`;

  constructor(
    public transactionSignature: TransactionSignature,
    public mintTokenData: MintTokenActionData,
  ) {}
}

export class MintTokenFail {
  static type = `${dashboardTokenItemStateId} ${MintTokenFail.name}`;

  constructor(public error: UnknownError) {}
}

export class ResetMintTokenProcess {
  static type = `${dashboardTokenItemStateId} ${ResetMintTokenProcess.name}`;
}
