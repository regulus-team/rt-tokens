import {PublicKey} from '@solana/web3.js';
import {RtTokenMetadata} from '../../rt-ipfs/symbols';

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

/**
 * Data for the mint token action.
 */
export interface BurnTokenActionData {
  /** Public key of the token account (holds tokens). */
  tokenAccountPublicKey: PublicKey;

  /** Public key of the associated token account (holds token metadata). */
  associatedTokenAccountPublicKey: PublicKey;

  /** Public key of the account with the ownership authority over the token account. */
  tokenAccountOwnerPublicKey: PublicKey;

  /** Number of tokens to mint. */
  tokenNumber: number;
}

/**
 * Data for the freeze token action.
 */
export interface FreezeOrThawTokenActionData {
  /** Public key of the token account (holds tokens). */
  tokenAccountPublicKey: PublicKey;

  /** Public key of the associated token account (holds token metadata). */
  associatedTokenAccountPublicKey: PublicKey;

  /** Public key of the account with the freeze authority. */
  freezeAuthorityPublicKey: PublicKey;
}

/**
 * Data for create fungible token action.
 */
export interface CreateFungibleTokenActionData extends RtTokenMetadata {
  /** The number of decimals for the token. */
  decimals: number;
}
