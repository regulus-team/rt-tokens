import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
  selector: 'app-dashboard-token-details',
  templateUrl: './dashboard-token-details.component.html',
  styleUrls: ['./dashboard-token-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardTokenDetailsComponent {


  // Todo: load the token details and check if the user has mint authority.
  // mintAccountKeypair: 7LMNNxJTkVty8QJjKL16e3tUMooX4AbecC7qNuBYojcg -- mint
  // associatedTokenAddress: FBPpt91h5RKgYcMMsgCzVEzoiEfZaLQDhc9xNw96YGd4 -- pubkey
  // public async mintToken(amount: number) {
  //   // Extract the current user's public key.
  //   const currentUserPubkey = currentWalletAdapter.publicKey as PublicKey;
  //
  //   const mintAccount = new PublicKey('7LMNNxJTkVty8QJjKL16e3tUMooX4AbecC7qNuBYojcg');
  //   const mintAuthority = currentUserPubkey;
  //   const associatedTokenAddress = new PublicKey('FBPpt91h5RKgYcMMsgCzVEzoiEfZaLQDhc9xNw96YGd4');
  //
  //
  //   // Get an associated token account of the wallet.
  //   const tokenAssociatedAccount = await getAssociatedTokenAddress(mintAccount, currentUserPubkey);
  //
  //   console.log('tokenAssociatedAccount:', tokenAssociatedAccount.toString());
  //
  //   const transaction = new Transaction().add(
  //     createMintToInstruction(
  //       mintAccount,
  //       associatedTokenAddress,
  //       mintAuthority,
  //       amount,
  //     ));
  //
  //   // Request the wallet to sign the transaction and send it to the cluster.
  //   const signedTransaction = await currentWalletAdapter.sendTransaction(transaction, connectionToCluster);
  //
  //   console.log('signedTransaction:', signedTransaction);
  // }
}
