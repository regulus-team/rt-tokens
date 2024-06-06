import {RpcResponseTokenData} from '../../symbols';
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
}

/** Default data for state initialization & reset. */
export const defaultDashboardTokenState: DashboardTokenStateModel = {
  loadTokenListProcess: progressStatuses.notInitialized,
  tokenList: [],
  lastLoadTokenListError: null,
};
