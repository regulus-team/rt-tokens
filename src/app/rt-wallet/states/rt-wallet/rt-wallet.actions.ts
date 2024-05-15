import {PublicKey} from '@solana/web3.js';
import {uniqueStateIdentifier} from './rt-wallet.model';

import {UnknownError} from '../../../shared/symbols/errors.symbols';
import {Lamports, TransactionSignature} from '../../../shared/symbols/solana.symbols';


export class ConnectPhantomWallet {
  static type = `${uniqueStateIdentifier} ${ConnectPhantomWallet.name}`;
}

export class ConnectPhantomWalletSuccess {
  static type = `${uniqueStateIdentifier} ${ConnectPhantomWalletSuccess.name}`;
}

export class ConnectPhantomWalletFail {
  static type = `${uniqueStateIdentifier} ${ConnectPhantomWalletFail.name}`;

  constructor(public unknownError: UnknownError) {
  }
}


export class GetWalletBalance {
  static type = `${uniqueStateIdentifier} ${GetWalletBalance.name}`;

  constructor(public publicKey: PublicKey) {
  }
}

export class GetWalletBalanceSuccess {
  static type = `${uniqueStateIdentifier} ${GetWalletBalanceSuccess.name}`;

  constructor(public balance: Lamports) {
  }
}

export class GetWalletBalanceFail {
  static type = `${uniqueStateIdentifier} ${GetWalletBalanceFail.name}`;

  constructor(public unknownError: UnknownError) {
  }
}

export class RequestAirdrop {
  static type = `${uniqueStateIdentifier} ${RequestAirdrop.name}`;

  constructor(public publicKey: PublicKey, public lamportsAmount: Lamports) {
  }
}

export class ConfirmAirdrop {
  static type = `${uniqueStateIdentifier} ${ConfirmAirdrop.name}`;

  constructor(public transactionSignature: TransactionSignature, public lamportsAmount: Lamports) {
  }
}

export class AirdropSuccess {
  static type = `${uniqueStateIdentifier} ${AirdropSuccess.name}`;

  constructor(public lamportsAmount: Lamports) {
  }
}

export class AirdropFail {
  static type = `${uniqueStateIdentifier} ${AirdropFail.name}`;

  constructor(public unknownError: UnknownError) {
  }
}


