import {filter, map, Subscription} from 'rxjs';
import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {PublicKey} from '@solana/web3.js';
import {Store} from '@ngxs/store';
import {tokenDetailsProgressStatuses} from '../../symbols';
import {LoadTokenDetails} from '../../states/dashboard-token/dashboard-token.actions';
import {DashboardTokenState} from '../../states/dashboard-token/dashboard-token.state';

@Component({
  selector: 'app-dashboard-token-details',
  templateUrl: './dashboard-token-details.component.html',
  styleUrls: ['./dashboard-token-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardTokenDetailsComponent implements OnInit, OnDestroy {
  public readonly loadTokenDetailsProcess$ = this.store.select(DashboardTokenState.loadTokenDetailsProcess);
  public readonly tokenAccount$ = this.store.select(DashboardTokenState.tokenAccount);
  public readonly associatedTokenAccount$ = this.store.select(DashboardTokenState.associatedTokenAccount);
  public readonly tokenAmount$ = this.store.select(DashboardTokenState.tokenAmount);
  public readonly supply$ = this.store.select(DashboardTokenState.supply);
  public readonly mintAuthority$ = this.store.select(DashboardTokenState.mintAuthority);
  public readonly freezeAuthority$ = this.store.select(DashboardTokenState.freezeAuthority);
  public readonly lastLoadTokenDetailsError$ = this.store.select(DashboardTokenState.lastLoadTokenDetailsError);

  /** Progress statuses of the token details loading. */
  public readonly tokenDetailsProgressStatuses = tokenDetailsProgressStatuses;

  /** Component's subscriptions. Will be unsubscribed when the component is destroyed. */
  private readonly subscription = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private store: Store,
  ) {}

  ngOnInit(): void {
    // Load token details when the route changes.
    this.subscription.add(
      this.route.params
        .pipe(
          // Extract the token id from the route.
          map(params => params?.['id']),

          // Filter out the empty values.
          filter(tokenId => !!tokenId),
        )
        .subscribe(tokenId => {
          // Load details for the token.
          const tokenPublicKey = new PublicKey(tokenId);
          this.store.dispatch(new LoadTokenDetails(tokenPublicKey));
        }),
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

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
