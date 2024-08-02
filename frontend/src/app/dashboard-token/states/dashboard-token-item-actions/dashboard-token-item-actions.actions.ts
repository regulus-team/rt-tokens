import {TransactionSignature} from '@solana/web3.js';
import {dashboardTokenItemActionsStateId} from './dashboard-token-item-actions.model';
import {CreateFungibleTokenActionData, MintTokenActionData} from '../../symbols/dashboard-token-action-data.symbols';
import {UnknownError} from '../../../shared/symbols/errors.symbols';

export class CreateFungibleToken {
  static type = `${dashboardTokenItemActionsStateId} ${CreateFungibleToken.name}`;

  constructor(public tokenMetadata: CreateFungibleTokenActionData) {}
}

export class CreateFungibleTokenSuccess {
  static type = `${dashboardTokenItemActionsStateId} ${CreateFungibleTokenSuccess.name}`;

  constructor() {}
}

export class CreateFungibleTokenFail {
  static type = `${dashboardTokenItemActionsStateId} ${CreateFungibleTokenFail.name}`;

  constructor(public error: UnknownError) {}
}

export class MintToken {
  static type = `${dashboardTokenItemActionsStateId} ${MintToken.name}`;

  constructor(public mintTokenData: MintTokenActionData) {}
}

export class MintTokenSuccess {
  static type = `${dashboardTokenItemActionsStateId} ${MintTokenSuccess.name}`;

  constructor(
    public transactionSignature: TransactionSignature,
    public mintTokenData: MintTokenActionData,
  ) {}
}

export class MintTokenFail {
  static type = `${dashboardTokenItemActionsStateId} ${MintTokenFail.name}`;

  constructor(public error: UnknownError) {}
}

export class ResetMintTokenProcess {
  static type = `${dashboardTokenItemActionsStateId} ${ResetMintTokenProcess.name}`;
}
