import {AccountInfo, ParsedAccountData, PublicKey} from '@solana/web3.js';

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

  /** The token details are loaded. */
  succeed = 'succeed',

  /** The token details loading failed. */
  interrupted = 'interrupted',
}

/**
 * The RPC response token data.
 */
export interface RpcResponseTokenData {
  /** The public key of the token account. */
  pubkey: PublicKey;

  /** The account information. */
  account: AccountInfo<ParsedAccountData>;
}

/**
 * Extended parsed account data with the custom data for specific addresses.
 */
export interface ExtendedParsedAccountData<T = any> extends ParsedAccountData {
  /** Parsing result. */
  parsed: T;
}

/**
 * RCP response for the request with the address of the user account.
 */
export interface RpcResponseUserAccount {
  /** Raw account data. */
  data: Uint8Array;

  /** Indicates if the address contains any executable code. */
  executable: boolean;

  /** The number of lamports owned by the account. */
  lamports: number;

  /** The address of the account owner. */
  owner: PublicKey;

  /** The minimum lamports balance required to keep the account undeleted. */
  rentEpoch: number;

  /** The amount of space in bytes reserved for the account data. */
  space: number;
}

/**
 * RCP response for the request with the address of the token account.
 * Token account is used for storing some specific token amount.
 */
export type RpcResponseTokenAccount = ExtendedParsedAccountData<TokenAccountData>;

/**
 * The token account data provided into the parsed account data.
 */
export interface TokenAccountData {
  /** The token account data info. */
  info: TokenAccountDataInfo;

  /** The type of the address (always "account" for the token account). */
  type: 'account';
}

/**
 * The token account data info.
 */
export interface TokenAccountDataInfo {
  /** Indicates whether the token account is native (related to the native SOL token). */
  isNative: boolean;

  /** The address of the account with the mint authority. */
  mint: PublicKeyString;

  /** The address of the account owner. */
  owner: PublicKeyString;

  /** Some account state status (todo: add additional info once it is available). */
  state: string;

  /** The amount of the token in the account. */
  tokenAmount: TokenAccountDataInfoAmount;
}

/**
 * Information about the token amount.
 */
export interface TokenAccountDataInfoAmount {
  /** The amount of the token before applying the decimals. */
  amount: string;

  /** The decimals of the token. */
  decimals: number;

  /** The amount of the token after applying the decimals. */
  uiAmount: number;

  /** The amount of the token after applying the decimals as a string. */
  uiAmountString: string;
}

/**
 * RCP response for the request with the address of the associated token account.
 * Token account is used for storing some specific token metadata.
 */
export type RpcResponseAssociatedTokenAccount = ExtendedParsedAccountData<AssociatedTokenAccountData>;

/**
 * The associated token account data provided into the parsed account data.
 */
export interface AssociatedTokenAccountData {
  /** The associated token account data info. */
  info: AssociatedTokenAccountDataInfo;

  /** The type of the address (always "mint" for the associated token account). */
  type: 'mint';
}

/**
 * The associated token account data info.
 */
export interface AssociatedTokenAccountDataInfo {
  /** The decimal number of the token. */
  decimals: number;

  /** The address of the account with the token freeze authority. */
  freezeAuthority: PublicKeyString;

  /** Indicates whether the token account is initialized. */
  isInitialized: boolean;

  /** The address of the account with the token mint authority. */
  mintAuthority: PublicKeyString;

  /** The number of the tokens presents in the blockchain. */
  supply: string;
}
