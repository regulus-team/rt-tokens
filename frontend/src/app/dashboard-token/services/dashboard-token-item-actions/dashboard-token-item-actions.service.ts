import {Injectable} from '@angular/core';
import {
  createBurnInstruction,
  createFreezeAccountInstruction,
  createMintToInstruction,
  createThawAccountInstruction,
} from '@solana/spl-token';
import {Transaction} from '@solana/web3.js';
import {createAndMint, mplTokenMetadata, TokenStandard, transferV1} from '@metaplex-foundation/mpl-token-metadata';
import {walletAdapterIdentity} from '@metaplex-foundation/umi-signer-wallet-adapters';
import {generateSigner, percentAmount, RpcConfirmTransactionResult, Signer, some, TransactionSignature} from '@metaplex-foundation/umi';
import {
  BurnTokenActionData,
  FreezeOrThawTokenActionData,
  MintTokenActionData,
  TransferTokenActionData,
} from '../../symbols/dashboard-token-action-data.symbols';
import {UmiCompatibleSigner} from '../../symbols/dashboard-token-umi-compatible-signer.symbol';
import {toUmiPublicKey, UmiPublicKey} from '../../symbols/dashboard-token-resolve-non-compatible-types.symbols';
import {RtSolanaService} from '../../../rt-solana/services/rt-solana/rt-solana.service';

@Injectable()
export class DashboardTokenItemActionsService {
  /**
   * The current wallet adapter.
   * Used for all wallet-related operations.
   */
  public readonly currentWalletAdapter = this.rtSolana.currentWalletAdapter;

  /**
   * Connection to the current Solana network cluster.
   */
  public readonly currentClusterConnection = this.rtSolana.currentClusterConnection;

  constructor(private rtSolana: RtSolanaService) {}

  /**
   * Create a new fungible token.
   * @param tokenName - The name of the token.
   * @param tokenDecimals - The number of decimals for the token.
   * @param tokenMetadataIpfsUrl - The IPFS URL of the token metadata.
   */
  public async createFungibleToken(
    tokenName: string,
    tokenDecimals: number,
    tokenMetadataIpfsUrl: string,
  ): Promise<{
    result: {context: {slot: number}; value: {err: null | string | unknown}};
    signature: Uint8Array;
  }> {
    // Create new UMI instance with the current RPC URL and the Metaplex token metadata plugin.
    const umi = this.rtSolana.getNewUmiInstance();
    umi.use(mplTokenMetadata()).use(walletAdapterIdentity(this.currentWalletAdapter));

    // Generate a signer for the UMI instance.
    const umiSigner = generateSigner(umi);

    // Create a new token, associated account, metadata, and mint it.
    return createAndMint(umi, {
      mint: umiSigner,
      name: tokenName,
      uri: tokenMetadataIpfsUrl,
      sellerFeeBasisPoints: percentAmount(5.5),
      decimals: some(tokenDecimals), // for 0 decimals use some(0)
      tokenStandard: TokenStandard.Fungible,
    }).sendAndConfirm(umi);
  }

  /**
   * Mint a specific number of tokens.
   * @param mintTokenActionData - Data required to mint tokens.
   */
  public mintSpecificToken(mintTokenActionData: MintTokenActionData): Promise<string> {
    // Create a transaction that mints tokens.
    const transaction = new Transaction().add(
      createMintToInstruction(
        mintTokenActionData.associatedTokenAccountPublicKey,
        mintTokenActionData.tokenAccountPublicKey,
        mintTokenActionData.mintAuthorityPublicKey,
        mintTokenActionData.tokenNumber,
      ),
    );

    // Request the wallet to sign the transaction and send it to the cluster.
    return this.currentWalletAdapter.sendTransaction(transaction, this.currentClusterConnection);
  }

  /**
   * Burn a specific number of tokens.
   * @param burnTokenActionData - Data required to burn tokens.
   */
  public burnSpecificToken(burnTokenActionData: BurnTokenActionData): Promise<string> {
    // Create a transaction that burns tokens.
    const transaction = new Transaction().add(
      createBurnInstruction(
        burnTokenActionData.tokenAccountPublicKey,
        burnTokenActionData.associatedTokenAccountPublicKey,
        burnTokenActionData.tokenAccountOwnerPublicKey,
        burnTokenActionData.tokenNumber,
      ),
    );

    // Request the wallet to sign the transaction and send it to the cluster.
    return this.currentWalletAdapter.sendTransaction(transaction, this.currentClusterConnection);
  }

  /**
   * Freeze a specific token.
   * @param freezeTokenActionData - Data required to freeze token.
   */
  public freezeSpecificToken(freezeTokenActionData: FreezeOrThawTokenActionData): Promise<string> {
    // Create a transaction that freezes the token.
    const transaction = new Transaction().add(
      createFreezeAccountInstruction(
        freezeTokenActionData.tokenAccountPublicKey,
        freezeTokenActionData.associatedTokenAccountPublicKey,
        freezeTokenActionData.freezeAuthorityPublicKey,
      ),
    );

    // Request the wallet to sign the transaction and send it to the cluster.
    return this.currentWalletAdapter.sendTransaction(transaction, this.currentClusterConnection);
  }

  /**
   * Thaw a specific token.
   * @param thawTokenActionData - Data required to thaw token.
   */
  public thawSpecificToken(thawTokenActionData: FreezeOrThawTokenActionData): Promise<string> {
    // Create a transaction that thaws the token.
    const transaction = new Transaction().add(
      createThawAccountInstruction(
        thawTokenActionData.tokenAccountPublicKey,
        thawTokenActionData.associatedTokenAccountPublicKey,
        thawTokenActionData.freezeAuthorityPublicKey,
      ),
    );

    // Request the wallet to sign the transaction and send it to the cluster.
    return this.currentWalletAdapter.sendTransaction(transaction, this.currentClusterConnection);
  }

  /**
   * Transfer a specific token.
   * @param transferTokenActionData - Data required to transfer token.
   */
  public transferSpecificToken(transferTokenActionData: TransferTokenActionData): Promise<{
    signature: TransactionSignature;
    result: RpcConfirmTransactionResult;
  }> {
    // Create a new UMI instance with the current RPC URL and the Metaplex token metadata plugin.
    const umi = this.rtSolana.getNewUmiInstance();
    umi.use(mplTokenMetadata()).use(walletAdapterIdentity(this.currentWalletAdapter));

    // Generate a signer for the UMI instance based on the current wallet adapter.
    const umiSigner: Signer = new UmiCompatibleSigner(this.currentWalletAdapter);

    // Convert the destination owner public key to a UMI-compatible public key.
    let destinationOwnerPublicKey: UmiPublicKey;
    try {
      destinationOwnerPublicKey = toUmiPublicKey(transferTokenActionData.destinationOwner);
    } catch (error) {
      return Promise.reject(error);
    }

    // Use the UMI instance to transfer the token.
    return transferV1(umi, {
      mint: toUmiPublicKey(transferTokenActionData.mint),
      authority: umiSigner,
      tokenOwner: toUmiPublicKey(transferTokenActionData.tokenOwner),
      destinationOwner: destinationOwnerPublicKey,
      amount: transferTokenActionData.amount,
      tokenStandard: TokenStandard.Fungible,
    }).sendAndConfirm(umi);
  }
}
