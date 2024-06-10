import {PublicKey} from '@solana/web3.js';

/**
 * Data for the mint token action.
 */
export interface MintTokenActionData {
  /** Public key of the token account (holds tokens). */
  tokenAccountPublicKey: PublicKey;

  /** Public key of the associated token account (holds token metadata). */
  associatedTokenAccountPublicKey: PublicKey;

  /** Public key of the account with the mint authority. */
  mintAuthorityPublicKey: PublicKey;

  /** Number of tokens to mint. */
  tokenNumber: number;
}
