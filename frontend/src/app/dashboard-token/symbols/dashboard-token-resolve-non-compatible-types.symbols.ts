import {
  Keypair as SolanaKeypair,
  PublicKey as PublicKeySolana,
  Signer as SignerSolana,
  Transaction as TransactionSolana,
  VersionedTransaction as VersionedTransactionSolana,
} from '@solana/web3.js';
import {
  Context,
  createSignerFromKeypair,
  Keypair as UmiKeypair,
  KeypairSigner,
  PublicKey as PublicKeyUmi,
  publicKey,
  Signer as SignerUmi,
  Transaction as TransactionUmi,
} from '@metaplex-foundation/umi';

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
 * Define the Umi signer type with different name.
 * Used to avoid conflicts with the Solana signer type.
 */
export type UmiSigner = SignerUmi;

/**
 * Define the transform function for the Solana public key to the UMI public key with another name.
 */
export const toUmiPublicKey = publicKey;

/**
 * Define the Solana transaction type with different name.
 * Used to avoid conflicts with the UMI transaction type.
 */
export type SolTransaction = TransactionSolana;

/**
 * Define the Solana versioned transaction type with different name.
 * Used to avoid conflicts with the UMI versioned transaction type.
 */
export type SolVersionedTransaction = VersionedTransactionSolana;

/**
 * Define the Solana signer type with different name.
 * Used to avoid conflicts with the UMI signer type.
 */
export type SolSigner = SignerSolana;

/**
 * Define the Umi transaction type with different name.
 * Used to avoid conflicts with the Solana transaction type.
 */
export type UmiTransaction = TransactionUmi;

/**
 * Define the Solana public key type with different name.
 * Used to avoid conflicts with the Umi public key type.
 */
export type SolPublicKey = PublicKeySolana;
