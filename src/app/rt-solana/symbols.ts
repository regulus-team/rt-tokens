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
