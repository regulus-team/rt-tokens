import {dashboardTokenStateId} from './dashboard-token.model';
import {UnknownError} from '../../../shared/symbols/errors.symbols';
import {AccountInfo, PublicKey, RpcResponseAndContext, TransactionSignature} from '@solana/web3.js';
import {
  RpcResponseAssociatedTokenAccount,
  RpcResponseTokenAccount,
  RpcResponseTokenData,
} from '../../symbols/dashboard-token-rcp-responce.symbols';
import {CreateFungibleTokenActionData, MintTokenActionData} from '../../symbols/dashboard-token-action-data.symbols';

export class LoadTokenList {
  static type = `${dashboardTokenStateId} ${LoadTokenList.name}`;

  constructor(public publicKey: PublicKey) {}
}

export class LoadTokenListSuccess {
  static type = `${dashboardTokenStateId} ${LoadTokenListSuccess.name}`;

  constructor(public tokenListContext: RpcResponseAndContext<RpcResponseTokenData[]>) {}
}

export class LoadTokenListFail {
  static type = `${dashboardTokenStateId} ${LoadTokenListFail.name}`;

  constructor(public error: UnknownError) {}
}

export class ReloadCurrentTokenDetails {
  static type = `${dashboardTokenStateId} ${ReloadCurrentTokenDetails.name}`;
}

export class LoadTokenDetails {
  static type = `${dashboardTokenStateId} ${LoadTokenDetails.name}`;

  constructor(public publicKey: PublicKey) {}
}

export class LoadAssociatedTokenAccount {
  static type = `${dashboardTokenStateId} ${LoadAssociatedTokenAccount.name}`;

  constructor(public tokenAccountData: RpcResponseAndContext<AccountInfo<RpcResponseTokenAccount>>) {}
}

export class LoadTokenDetailsSuccess {
  static type = `${dashboardTokenStateId} ${LoadTokenDetailsSuccess.name}`;

  constructor(public associatedTokenAccount: RpcResponseAndContext<AccountInfo<RpcResponseAssociatedTokenAccount>>) {}
}

export class LoadTokenDetailsFail {
  static type = `${dashboardTokenStateId} ${LoadTokenDetailsFail.name}`;

  constructor(public error: UnknownError) {}
}

export class CreateFungibleToken {
  static type = `${dashboardTokenStateId} ${CreateFungibleToken.name}`;

  constructor(public tokenMetadata: CreateFungibleTokenActionData) {}
}

export class CreateFungibleTokenSuccess {
  static type = `${dashboardTokenStateId} ${CreateFungibleTokenSuccess.name}`;

  constructor() {}
}

export class CreateFungibleTokenFail {
  static type = `${dashboardTokenStateId} ${CreateFungibleTokenFail.name}`;

  constructor(public error: UnknownError) {}
}

export class MintToken {
  static type = `${dashboardTokenStateId} ${MintToken.name}`;

  constructor(public mintTokenData: MintTokenActionData) {}
}

export class MintTokenSuccess {
  static type = `${dashboardTokenStateId} ${MintTokenSuccess.name}`;

  constructor(
    public transactionSignature: TransactionSignature,
    public mintTokenData: MintTokenActionData,
  ) {}
}

export class MintTokenFail {
  static type = `${dashboardTokenStateId} ${MintTokenFail.name}`;

  constructor(public error: UnknownError) {}
}

export class ResetMintTokenProcess {
  static type = `${dashboardTokenStateId} ${ResetMintTokenProcess.name}`;
}
