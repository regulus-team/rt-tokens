import {progressStatuses} from '../../../shared/symbols/statuses.symbols';
import {UnknownError} from '../../../shared/symbols/errors.symbols';
import {RpcResponseTokenData} from '../../symbols/dashboard-token-rcp-responce.symbols';
import {Metadata} from '@metaplex-foundation/mpl-token-metadata/dist/src/generated/accounts/metadata';
import {PiledTokenData} from '../../../rt-solana/symbols';
import {MetadataJsonFieldsTokenAccountPair} from '../../symbols/dashboard-token-metadata-retrieval.symbols';

/** Unique identifier of the dashboard token list state. */
export const dashboardTokenListStateId = '_DashboardTokenList_';

/** Describes dashboard token list state model. */
export interface DashboardTokenListStateModel {
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
}

/** Default data for state initialization & reset. */
export const defaultDashboardTokenState: DashboardTokenListStateModel = {
  loadTokenListProcess: progressStatuses.notInitialized,
  tokenList: [],
  tokenListMetadata: [],
  tokenListMetadataJson: [],
  tokenListPiledData: [],
  lastLoadTokenListError: null,
};
