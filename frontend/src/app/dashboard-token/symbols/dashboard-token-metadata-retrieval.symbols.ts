import {MetadataJsonFields} from '../../rt-solana/symbols';

/**
 * Interface for a JSON URL and token account pair.
 * Used for correct assignment of the JSON metadata to the token account.
 */
export interface JsonUrlTokenAccountPair {
  /** The URL to the JSON metadata. */
  jsonUrl: string;

  /** The token account public key. */
  tokenAccount: string;
}

/**
 * Interface for a JSON metadata and token account pair.
 * Used for correct assignment of the JSON metadata to the token account.
 */
export interface MetadataJsonFieldsTokenAccountPair {
  /** The JSON metadata fields. */
  jsonMetadata: MetadataJsonFields;

  /** The token account public key. */
  tokenAccount: string;
}
