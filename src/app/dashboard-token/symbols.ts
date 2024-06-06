import {AccountInfo, ParsedAccountData, PublicKey} from '@solana/web3.js';

/**
 * The RPC response token data.
 */
export interface RpcResponseTokenData {
  /** The public key of the token account. */
  pubkey: PublicKey;

  /** The account information. */
  account: AccountInfo<ParsedAccountData>;
}

