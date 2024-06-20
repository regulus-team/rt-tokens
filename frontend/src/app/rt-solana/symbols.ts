import {Keypair as SolanaKeypair} from '@solana/web3.js';
import {Context, createSignerFromKeypair, Keypair as UmiKeypair, KeypairSigner, publicKey} from '@metaplex-foundation/umi';

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
