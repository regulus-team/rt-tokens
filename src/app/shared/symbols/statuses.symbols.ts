/**
 * Progress statuses for any async operations, like loading, calculations, etc.
 * May be used to display load state without creating a lot of variables.
 */
export enum progressStatuses {
  /** Display that process were not started yet. */
  notInitialized = 'not_initialized',

  /** Display that process started, but not finished yet. */
  inProgress = 'in_progress',

  /** Display that process started, and finished successfully. */
  succeed = 'succeed',

  /** Display that process started, but were interrupted by unexpected error. */
  interrupted = 'interrupted',
}
