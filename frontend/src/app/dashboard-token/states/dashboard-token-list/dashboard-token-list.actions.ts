import {Metadata} from '@metaplex-foundation/mpl-token-metadata/dist/src/generated/accounts/metadata';
import {PublicKey, RpcResponseAndContext} from '@solana/web3.js';
import {dashboardTokenListStateId} from './dashboard-token-list.model';
import {RpcResponseTokenData} from '../../symbols/dashboard-token-rcp-responce.symbols';
import {MetadataJsonFieldsTokenAccountPair} from '../../symbols/dashboard-token-metadata-retrieval.symbols';
import {UnknownError} from '../../../shared/symbols/errors.symbols';

export class LoadTokenList {
  static type = `${dashboardTokenListStateId} ${LoadTokenList.name}`;

  constructor(public publicKey: PublicKey) {}
}

export class LoadTokenListMetadata {
  static type = `${dashboardTokenListStateId} ${LoadTokenListMetadata.name}`;

  constructor(public tokenListContext: RpcResponseAndContext<RpcResponseTokenData[]>) {}
}

export class LoadTokenListMetadataJson {
  static type = `${dashboardTokenListStateId} ${LoadTokenListMetadataJson.name}`;

  constructor(public tokenListMetadata: Metadata[]) {}
}

export class LoadTokenListSuccess {
  static type = `${dashboardTokenListStateId} ${LoadTokenListSuccess.name}`;

  constructor(public tokenListMetadataJson: MetadataJsonFieldsTokenAccountPair[]) {}
}

export class LoadTokenListFail {
  static type = `${dashboardTokenListStateId} ${LoadTokenListFail.name}`;

  constructor(public error: UnknownError) {}
}
