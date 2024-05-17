import {dashboardTokenStateId} from './dashboard-token.model';
import {TokenListRPCResponse} from '../../symbols';
import {UnknownError} from '../../../shared/symbols/errors.symbols';


export class LoadTokenList {
  static type = `${dashboardTokenStateId} ${LoadTokenList.name}`;

  constructor(public publicKeyString: PublicKeyString) {
  }
}

export class LoadTokenListSuccess {
  static type = `${dashboardTokenStateId} ${LoadTokenListSuccess.name}`;

  constructor(public tokenList: TokenListRPCResponse) {
  }
}

export class LoadTokenListFail {
  static type = `${dashboardTokenStateId} ${LoadTokenListFail.name}`;

  constructor(public error: UnknownError) {
  }
}



