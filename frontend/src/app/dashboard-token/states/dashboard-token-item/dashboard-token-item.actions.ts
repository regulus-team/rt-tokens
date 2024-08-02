import {AccountInfo, PublicKey, RpcResponseAndContext} from '@solana/web3.js';
import {Metadata} from '@metaplex-foundation/mpl-token-metadata/dist/src/generated/accounts/metadata';
import {dashboardTokenItemStateId} from './dashboard-token-item.model';
import {RpcResponseAssociatedTokenAccount, RpcResponseTokenAccount} from '../../symbols/dashboard-token-rcp-responce.symbols';
import {MetadataJsonFieldsTokenAccountPair} from '../../symbols/dashboard-token-metadata-retrieval.symbols';
import {UnknownError} from '../../../shared/symbols/errors.symbols';
import {MetadataJsonFields} from '../../../rt-solana/symbols';

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

export class LoadMetadataTokenAccount {
  static type = `${dashboardTokenItemStateId} ${LoadMetadataTokenAccount.name}`;

  constructor(public associatedTokenAccount: RpcResponseAndContext<AccountInfo<RpcResponseAssociatedTokenAccount>>) {}
}

export class LoadMetadataTokenJson {
  static type = `${dashboardTokenItemStateId} ${LoadMetadataTokenJson.name}`;

  constructor(public tokenMetadata: Nullable<Metadata>) {}
}

export class LoadTokenDetailsSuccess {
  static type = `${dashboardTokenItemStateId} ${LoadTokenDetailsSuccess.name}`;

  constructor(public tokenMetadataJson: MetadataJsonFieldsTokenAccountPair<Nullable<MetadataJsonFields>>) {}
}

export class LoadTokenDetailsFail {
  static type = `${dashboardTokenItemStateId} ${LoadTokenDetailsFail.name}`;

  constructor(public error: UnknownError) {}
}
