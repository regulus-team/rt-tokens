import {dashboardTokenStateId} from './dashboard-token.model';
import {RpcResponseTokenData} from '../../symbols';
import {UnknownError} from '../../../shared/symbols/errors.symbols';
import {PublicKey, RpcResponseAndContext} from '@solana/web3.js';


export class LoadTokenList {
  static type = `${dashboardTokenStateId} ${LoadTokenList.name}`;

  constructor(public publicKey: PublicKey) {
  }
}

export class LoadTokenListSuccess {
  static type = `${dashboardTokenStateId} ${LoadTokenListSuccess.name}`;

  constructor(public tokenListContext: RpcResponseAndContext<RpcResponseTokenData[]>) {
  }
}

export class LoadTokenListFail {
  static type = `${dashboardTokenStateId} ${LoadTokenListFail.name}`;

  constructor(public error: UnknownError) {
  }
}



