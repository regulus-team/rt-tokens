/**
 * Loading of the token details includes two steps:
 * 1. Loading the token account.
 * 2. Loading the associated token account.
 *
 * The first one contains the token amount, the second one contains the token metadata.
 *
 * To clearly indicate the progress of the token details loading, the following statuses are used.
 */
export enum tokenDetailsProgressStatuses {
  /** The token details are not initialized. */
  notInitialized = 'notInitialized',

  /** The token account is loading. */
  loadingTokenAccount = 'loadingTokenAccount',

  /** The associated token account is loading. */
  loadingAssociatedTokenAccount = 'loadingAssociatedTokenAccount',

  /** The metadata account is loading. */
  loadingMetadataAccount = 'loadingMetadataAccount',

  /** The metadata JSON file is loading. */
  loadingMetadataJson = 'loadingMetadataJson',

  /** The token details are loaded. */
  succeed = 'succeed',

  /** The token details loading failed. */
  interrupted = 'interrupted',
}
