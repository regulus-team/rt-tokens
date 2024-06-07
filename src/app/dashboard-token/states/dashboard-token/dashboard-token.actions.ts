import {dashboardTokenStateId} from './dashboard-token.model';
import {RpcResponseAssociatedTokenAccount, RpcResponseTokenAccount, RpcResponseTokenData} from '../../symbols';
import {UnknownError} from '../../../shared/symbols/errors.symbols';
import {AccountInfo, PublicKey, RpcResponseAndContext} from '@solana/web3.js';

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
