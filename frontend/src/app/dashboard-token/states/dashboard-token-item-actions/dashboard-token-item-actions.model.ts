import {UnknownError} from '../../../shared/symbols/errors.symbols';
import {progressStatuses} from '../../../shared/symbols/statuses.symbols';

/** Unique identifier of the dashboard token item actions state. */
export const dashboardTokenItemActionsStateId = '_DashboardTokenItemActions_';

/** Describes dashboard token item actions state model. */
export interface DashboardTokenItemActionsStateModel {
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
export const defaultDashboardTokenItemActionsState: DashboardTokenItemActionsStateModel = {
  createTokenProcess: progressStatuses.notInitialized,
  lastCreateTokenError: null,

  mintTokenProcess: progressStatuses.notInitialized,
  lastMintTokenError: null,
};
