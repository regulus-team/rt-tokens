import {RpcResponseTokenData, TokenAccountDataInfoAmount, tokenDetailsProgressStatuses} from '../../symbols';
import {progressStatuses} from '../../../shared/symbols/statuses.symbols';
import {UnknownError} from '../../../shared/symbols/errors.symbols';

/** Unique identifier of the dashboard token state. */
export const dashboardTokenStateId = '_DashboardToken_';

/** Describes dashboard token state model. */
export interface DashboardTokenStateModel {
  /** Contain current process status of the token list loading. */
  loadTokenListProcess: progressStatuses;

  /** Contain a list of all tokens for the requested account. */
  tokenList: RpcResponseTokenData[];

  /** Contain last error that occurred during the token list loading. */
  lastLoadTokenListError: Nullable<UnknownError>;

  /** Contain current process status of the token details loading. */
  loadTokenDetailsProcess: tokenDetailsProgressStatuses;

  /** Contain the public key string of the token account for the currently loaded token. */
  tokenAccount: Nullable<PublicKeyString>;

  /** Contain the public key string of the associated token account for the currently loaded token. */
  associatedTokenAccount: Nullable<PublicKeyString>;

  /** Contain the amount details of the currently loaded token. */
  tokenAmount: Nullable<TokenAccountDataInfoAmount>;

  /** Contain the supply of the currently loaded token. */
  supply: Nullable<string>;

  /** Contain the public key string of the account with the mint authority for the currently loaded token. */
  mintAuthority: Nullable<PublicKeyString>;

  /** Contain the public key string of the account with the freeze authority for the currently loaded token. */
  freezeAuthority: Nullable<PublicKeyString>;

  /** Contain the last error that occurred during the token details loading. */
  lastLoadTokenDetailsError: Nullable<UnknownError>;
}

/** Default data for state initialization & reset. */
export const defaultDashboardTokenState: DashboardTokenStateModel = {
  loadTokenListProcess: progressStatuses.notInitialized,
  tokenList: [],
  lastLoadTokenListError: null,

  loadTokenDetailsProcess: tokenDetailsProgressStatuses.notInitialized,

  tokenAccount: null,
  associatedTokenAccount: null,
  tokenAmount: null,
  supply: null,
  mintAuthority: null,
  freezeAuthority: null,

  lastLoadTokenDetailsError: null,
};
