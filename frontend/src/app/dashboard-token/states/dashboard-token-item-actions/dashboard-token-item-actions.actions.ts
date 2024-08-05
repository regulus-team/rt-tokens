import {TransactionSignature} from '@solana/web3.js';
import {dashboardTokenItemActionsStateId} from './dashboard-token-item-actions.model';
import {
  BurnTokenActionData,
  CreateFungibleTokenActionData,
  FreezeOrThawTokenActionData,
  MintTokenActionData,
} from '../../symbols/dashboard-token-action-data.symbols';
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

export class BurnToken {
  static type = `${dashboardTokenItemActionsStateId} ${BurnToken.name}`;

  constructor(public burnTokenData: BurnTokenActionData) {}
}

export class BurnTokenSuccess {
  static type = `${dashboardTokenItemActionsStateId} ${BurnTokenSuccess.name}`;

  constructor(
    public transactionSignature: TransactionSignature,
    public burnTokenData: BurnTokenActionData,
  ) {}
}

export class BurnTokenFail {
  static type = `${dashboardTokenItemActionsStateId} ${BurnTokenFail.name}`;

  constructor(public error: UnknownError) {}
}

export class ResetBurnTokenProcess {
  static type = `${dashboardTokenItemActionsStateId} ${ResetBurnTokenProcess.name}`;
}

export class FreezeToken {
  static type = `${dashboardTokenItemActionsStateId} ${FreezeToken.name}`;

  constructor(public freezeTokenData: FreezeOrThawTokenActionData) {}
}

export class FreezeTokenSuccess {
  static type = `${dashboardTokenItemActionsStateId} ${FreezeTokenSuccess.name}`;

  constructor(
    public transactionSignature: TransactionSignature,
    public freezeTokenData: FreezeOrThawTokenActionData,
  ) {}
}

export class FreezeTokenFail {
  static type = `${dashboardTokenItemActionsStateId} ${FreezeTokenFail.name}`;

  constructor(public error: UnknownError) {}
}

export class ThawToken {
  static type = `${dashboardTokenItemActionsStateId} ${ThawToken.name}`;

  constructor(public thawTokenData: FreezeOrThawTokenActionData) {}
}

export class ThawTokenSuccess {
  static type = `${dashboardTokenItemActionsStateId} ${ThawTokenSuccess.name}`;

  constructor(
    public transactionSignature: TransactionSignature,
    public thawTokenData: FreezeOrThawTokenActionData,
  ) {}
}

export class ThawTokenFail {
  static type = `${dashboardTokenItemActionsStateId} ${ThawTokenFail.name}`;

  constructor(public error: UnknownError) {}
}
