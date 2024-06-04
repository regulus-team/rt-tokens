import {clusterApiUrl, Connection} from '@solana/web3.js';
import {PhantomWalletAdapter} from '@solana/wallet-adapter-wallets';

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
 * Current Solana network cluster.
 */
export const currentNetCluster: NetCluster = clusterApiUrl('devnet') as NetCluster;


/**
 * Current wallet adapter.
 * Used for working with the wallet.
 */
export const currentWalletAdapter = new PhantomWalletAdapter();

/**
 * Connection to the Solana network cluster.
 */
export const connectionToCluster = new Connection(currentNetCluster, 'confirmed');

// Todo: move to environment variables.
export const mainNetBetaRPCApi = 'http://api.mainnet-beta.solana.com/';
export const devNetRPCApi = 'http://api.devnet.solana.com/';

