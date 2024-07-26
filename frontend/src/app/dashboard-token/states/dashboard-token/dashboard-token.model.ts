import {progressStatuses} from '../../../shared/symbols/statuses.symbols';
import {UnknownError} from '../../../shared/symbols/errors.symbols';
import {PublicKey} from '@solana/web3.js';
import {tokenDetailsProgressStatuses} from '../../symbols/dashboard-token-general.symbols';
import {RpcResponseTokenData, TokenAccountDataInfoAmount} from '../../symbols/dashboard-token-rcp-responce.symbols';
import {Metadata} from '@metaplex-foundation/mpl-token-metadata/dist/src/generated/accounts/metadata';
import {PiledTokenData} from '../../../rt-solana/symbols';
import {MetadataJsonFieldsTokenAccountPair} from '../../symbols/dashboard-token-metadata-retrieval.symbols';

/** Unique identifier of the dashboard token state. */
export const dashboardTokenStateId = '_DashboardToken_';

/** Describes dashboard token state model. */
export interface DashboardTokenStateModel {
  /** Contain current process status of the token list loading. */
  loadTokenListProcess: progressStatuses;

  /** Contain a list of all tokens for the requested account. */
  tokenList: RpcResponseTokenData[];

  /** Contain a list of all token metadata for the requested account. */
  tokenListMetadata: Metadata[];

  /** Contain a list of all token metadata JSON for the requested account. */
  tokenListMetadataJson: MetadataJsonFieldsTokenAccountPair[];

  /** Contain a list of all piled token data for the requested account. */
  tokenListPiledData: PiledTokenData[];

  /** Contain last error that occurred during the token list loading. */
  lastLoadTokenListError: Nullable<UnknownError>;

  /** Contain current process status of the token details loading. */
  loadTokenDetailsProcess: tokenDetailsProgressStatuses;

  /** Contain the public key string of the token account for the currently loaded token. */
  tokenAccount: Nullable<PublicKey>;

  /** Contain the public key string of the associated token account for the currently loaded token. */
  associatedTokenAccount: Nullable<PublicKey>;

  /** Contain the amount details of the currently loaded token. */
  tokenAmount: Nullable<TokenAccountDataInfoAmount>;

  /** Contain the supply of the currently loaded token. */
  supply: Nullable<string>;

  /** Contain the public key string of the account with the mint authority for the currently loaded token. */
  mintAuthority: Nullable<PublicKey>;

  /** Contain the public key string of the account with the freeze authority for the currently loaded token. */
  freezeAuthority: Nullable<PublicKey>;

  /** Contain the last error that occurred during the token details loading. */
  lastLoadTokenDetailsError: Nullable<UnknownError>;

  /** Contain current process status of the creating token process. */
  createTokenProcess: progressStatuses;

  /** Contain the last error that occurred during the creating token process. */
  lastCreateTokenError: Nullable<UnknownError>;

  /** Contain current process status of the mint token process. */
  mintTokenProcess: progressStatuses;

  /** Contain the last error that occurred during the minting token process. */
  lastMintTokenError: Nullable<UnknownError>;
}

/** Default data for state initialization & reset. */
export const defaultDashboardTokenState: DashboardTokenStateModel = {
  loadTokenListProcess: progressStatuses.notInitialized,
  tokenList: [],
  tokenListMetadata: [],
  tokenListMetadataJson: [],
  tokenListPiledData: [],
  lastLoadTokenListError: null,

  loadTokenDetailsProcess: tokenDetailsProgressStatuses.notInitialized,

  tokenAccount: null,
  associatedTokenAccount: null,
  tokenAmount: null,
  supply: null,
  mintAuthority: null,
  freezeAuthority: null,

  lastLoadTokenDetailsError: null,

  createTokenProcess: progressStatuses.notInitialized,
  lastCreateTokenError: null,

  mintTokenProcess: progressStatuses.notInitialized,
  lastMintTokenError: null,
};
