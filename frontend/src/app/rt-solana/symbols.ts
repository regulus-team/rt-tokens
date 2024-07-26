import {Keypair as SolanaKeypair, PublicKey as PublicKeySolana} from '@solana/web3.js';
import {
  Context,
  createSignerFromKeypair,
  Keypair as UmiKeypair,
  KeypairSigner,
  publicKey,
  PublicKey as PublicKeyUmi,
} from '@metaplex-foundation/umi';
import {RpcResponseTokenData} from '../dashboard-token/symbols/dashboard-token-rcp-responce.symbols';
import {Metadata} from '@metaplex-foundation/mpl-token-metadata/dist/src/generated/accounts/metadata';

/**
 * Solana lesser currency unit.
 * 1 Sol = 1_000_000_000 Lamports
 */
export type Lamports = number;

/**
 * Solana larger currency unit.
 * 1 Sol = 1_000_000_000 Lamports
 */
export type Sols = number;

/**
 * The transaction signature.
 * A transaction signature is a hash of a transaction that has been signed by the sender.
 */
export type TransactionSignature = string;

/**
 * The type of the network cluster.
 * A Solana cluster is a set of validators working together to serve client transactions and maintain the integrity of the ledger.
 * Many clusters may coexist.
 *
 * Docs: https://docs.solanalabs.com/clusters
 */
export type NetCluster = 'devnet' | 'testnet' | 'mainnet-beta';

/**
 * Solana and UMI have the same type name for the keypair, but different implementations.
 * This function converts a Solana keypair to a UMI keypair.
 * @param solanaKeypair - The Solana keypair.
 */
export const solanaKeypairToUmiKeypair = (solanaKeypair: SolanaKeypair): UmiKeypair => ({
  publicKey: publicKey(solanaKeypair.publicKey.toBytes()),
  secretKey: solanaKeypair.secretKey,
});

/**
 * Create a signer from a Solana keypair (instead of a UMI keypair).
 * @param context - The UMI context (usually a UMI instance created using `createUmi('rpcUrl')`).
 * @param keypair - The Solana keypair.
 */
export const createSignerFromSolanaKeypair = (context: Pick<Context, 'eddsa'>, keypair: SolanaKeypair): KeypairSigner =>
  createSignerFromKeypair(context, solanaKeypairToUmiKeypair(keypair));

/**
 * Define the UMI public key type with different name.
 * Used to avoid conflicts with the Solana public key type.
 */
export type UmiPublicKey = PublicKeyUmi;

/**
 * Define the Solana public key type with different name.
 * Used to avoid conflicts with the Umi public key type.
 */
export type SolPublicKey = PublicKeySolana;

/**
 * Define the transform function for the Solana public key to the UMI public key with another name.
 */
export const solToUmiPublicKey = publicKey;

/**
 * Define the piled data for the token.
 * As each token may contain its native data created by the token program, metadata provided by the Metaplex Foundation,
 * JSON data, and other data, this type is used to store all of them in one place.
 *
 * The process of retrieving the token data starts with loading of all associated token accounts.
 * Once they are loaded, the list of piled data is created; public key of the token account is stored in the `tokenAccount` field.
 * All other data is stored in the `tokenDetails` field.
 * Then, it is possible to calculate and try to retrieve the Metaplex metadata account.
 * If the load was successful, it is stored in the `metaplexMetadata` field.
 * If the Metaplex metadata is loaded and has `uri` field, the JSON data can be probed.
 * If the JSON data is loaded, it is stored in the `jsonMetadata` field.
 */
export interface PiledTokenData {
  /**
   * The main identifier of the token data - the public key of the token account.
   */
  tokenAccount: PublicKeyString;

  /**
   * The expected address of the Metaplex metadata account.
   * It always can be calculated, which doesn't mean that the account exists.
   */
  metadataAccountAddress: PublicKeyString;

  /**
   * The details of the token account.
   * Contains the native token data (provided by the token program).
   */
  tokenDetails: RpcResponseTokenData;

  /**
   * The Metaplex metadata account.
   * Contains the metadata provided by the Metaplex Foundation.
   * Some tokens may be created using other methods and may not have a Metaplex metadata.
   */
  metaplexMetadata?: Metadata;

  /**
   * The JSON metadata of the token.
   * Contains the data stored in the JSON linked as a URI in the Metaplex metadata.
   * The JSON metadata is not required and may not be present.
   */
  jsonMetadata?: MetadataJsonFields;
}

/**
 * Define the JSON metadata for the token.
 *
 * Anything can be stored in the JSON metadata.
 * The only probably displayed fields are described in the `MetadataJsonFields` type.
 */
export interface MetadataJsonFields {
  /**
   * The url to the IPFS storage of the token image.
   */
  image?: string;

  /**
   * The name of the token.
   */
  name?: string;

  /**
   * The symbol of the token.
   */
  symbol?: string;

  /**
   * The description of the token.
   */
  description?: string;
}
