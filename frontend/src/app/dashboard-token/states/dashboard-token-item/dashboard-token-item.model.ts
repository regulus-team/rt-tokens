import {PublicKey} from '@solana/web3.js';
import {Metadata} from '@metaplex-foundation/mpl-token-metadata/dist/src/generated/accounts/metadata';
import {TokenItemState} from '../../symbols/dashboard-token-general.symbols';
import {TokenAccountDataInfoAmount} from '../../symbols/dashboard-token-rcp-responce.symbols';
import {MetadataJsonFieldsTokenAccountPair} from '../../symbols/dashboard-token-metadata-retrieval.symbols';
import {UnknownError} from '../../../shared/symbols/errors.symbols';
import {MetadataJsonFields} from '../../../rt-solana/symbols';
import {progressStatuses} from '../../../shared/symbols/statuses.symbols';

/** Unique identifier of the dashboard token item state. */
export const dashboardTokenItemStateId = '_DashboardTokenItem_';

/** Describes dashboard token item state model. */
export interface DashboardTokenItemStateModel {
  /** Contain current process status of the token details loading. */
  loadTokenDetailsProcess: progressStatuses;

  /** Contain the public key string of the token account for the currently loaded token. */
  tokenAccount: Nullable<PublicKey>;

  /** Contain the public key string of the associated token account for the currently loaded token. */
  associatedTokenAccount: Nullable<PublicKey>;

  /** Contain the amount details of the currently loaded token. */
  tokenAmount: Nullable<TokenAccountDataInfoAmount>;

  /** Contain the supply of the currently loaded token. */
  supply: Nullable<string>;

  /** Contain the state of the token for the currently loaded token. */
  tokenState: Nullable<TokenItemState>;

  /** Contain the public key string of the account with the token owner for the currently loaded token. */
  tokenOwner: Nullable<PublicKey>;

  /** Contain the public key string of the account with the mint authority for the currently loaded token. */
  mintAuthority: Nullable<PublicKey>;

  /** Contain the public key string of the account with the freeze authority for the currently loaded token. */
  freezeAuthority: Nullable<PublicKey>;

  /** Contain the token metadata for the currently loaded token. */
  tokenMetadata: Nullable<Metadata>;

  /** Contain the token metadata JSON fields for the currently loaded token. */
  tokenMetadataJson: MetadataJsonFieldsTokenAccountPair<Nullable<MetadataJsonFields>>;

  /** Contain the last error that occurred during the token details loading. */
  lastLoadTokenDetailsError: Nullable<UnknownError>;
}

/** Default data for state initialization & reset. */
export const defaultDashboardTokenItemState: DashboardTokenItemStateModel = {
  loadTokenDetailsProcess: progressStatuses.notInitialized,

  tokenAccount: null,
  associatedTokenAccount: null,
  tokenAmount: null,
  supply: null,
  tokenState: null,
  tokenOwner: null,
  mintAuthority: null,
  freezeAuthority: null,
  tokenMetadata: null,
  tokenMetadataJson: {jsonMetadata: null, tokenAccount: ''},

  lastLoadTokenDetailsError: null,
};
