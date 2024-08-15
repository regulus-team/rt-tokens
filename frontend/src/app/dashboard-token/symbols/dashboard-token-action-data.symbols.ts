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
 * Data for the freeze (or thaw) token action.
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
 * Data for the transfer token action.
 */
export interface TransferTokenActionData {
  /** Public key of the associated token account (holds token metadata). */
  mint: PublicKey;

  /** Public key of the token owner account (authority over the token account). */
  tokenOwner: PublicKey;

  /** Transfer a destination account owner (authority over the destination token account). */
  destinationOwner: string;

  /** Number of tokens to transfer. */
  amount: number;
}

/**
 * Data for create fungible token action.
 */
export interface CreateFungibleTokenActionData extends RtTokenMetadata {
  /** The number of decimals for the token. */
  decimals: number;
}
