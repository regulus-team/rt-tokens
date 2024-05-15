import {progressStatuses} from '../../../shared/symbols/statuses.symbols';
import {UnknownError} from '../../../shared/symbols/errors.symbols';
import {Lamports} from '../../../shared/symbols/solana.symbols';

/** Unique identifier of the related state. */
export const uniqueStateIdentifier = '_RtWallet_';

/** Describes wallet state model. */
export interface RtWalletStateModel {
  /** Contain current process status of connecting wallet. */
  connectWalletStatus: progressStatuses;

  /** Contain last error that occurs during the connecting wallet process. */
  connectWalletError: Nullable<UnknownError>;

  /** Contain current process status of getting wallet balance. */
  loadBalanceStatus: progressStatuses;

  /** Contain current wallet balance. */
  currentBalance: Lamports;

  /** Contain last error that occurs during the getting wallet balance process. */
  loadBalanceError: Nullable<UnknownError>;

  /** Contain current process status of requesting airdrop. */
  updateBalanceStatus: progressStatuses;

  /** Contain last error that occurs during the requesting airdrop process. */
  updateBalanceError: Nullable<UnknownError>;
}

/** Default data for state initialization & reset. */
export const defaultRtWalletState: RtWalletStateModel = {
  connectWalletStatus: progressStatuses.notInitialized,
  connectWalletError: null,

  loadBalanceStatus: progressStatuses.notInitialized,
  currentBalance: 0,
  loadBalanceError: null,

  updateBalanceStatus: progressStatuses.notInitialized,
  updateBalanceError: null,
};
