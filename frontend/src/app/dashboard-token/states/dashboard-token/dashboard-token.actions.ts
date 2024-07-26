import {Metadata} from '@metaplex-foundation/mpl-token-metadata/dist/src/generated/accounts/metadata';
import {AccountInfo, PublicKey, RpcResponseAndContext, TransactionSignature} from '@solana/web3.js';
import {dashboardTokenStateId} from './dashboard-token.model';
import {
  RpcResponseAssociatedTokenAccount,
  RpcResponseTokenAccount,
  RpcResponseTokenData,
} from '../../symbols/dashboard-token-rcp-responce.symbols';
import {CreateFungibleTokenActionData, MintTokenActionData} from '../../symbols/dashboard-token-action-data.symbols';
import {MetadataJsonFieldsTokenAccountPair} from '../../symbols/dashboard-token-metadata-retrieval.symbols';
import {UnknownError} from '../../../shared/symbols/errors.symbols';

export class LoadTokenList {
  static type = `${dashboardTokenStateId} ${LoadTokenList.name}`;

  constructor(public publicKey: PublicKey) {}
}

export class LoadTokenListMetadata {
  static type = `${dashboardTokenStateId} ${LoadTokenListMetadata.name}`;

  constructor(public tokenListContext: RpcResponseAndContext<RpcResponseTokenData[]>) {}
}

export class LoadTokenListMetadataJson {
  static type = `${dashboardTokenStateId} ${LoadTokenListMetadataJson.name}`;

  constructor(public tokenListMetadata: Metadata[]) {}
}

export class LoadTokenListSuccess {
  static type = `${dashboardTokenStateId} ${LoadTokenListSuccess.name}`;

  constructor(public tokenListMetadataJson: MetadataJsonFieldsTokenAccountPair[]) {}
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
