import {filter, Observable, Subscription} from 'rxjs';
import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Select, Store} from '@ngxs/store';
import {ConnectPhantomWallet} from '../../../rt-wallet/states/rt-wallet/rt-wallet.actions';
import {RtWalletState} from '../../../rt-wallet/states/rt-wallet/rt-wallet.state';
import {RtWalletStateModel} from '../../../rt-wallet/states/rt-wallet/rt-wallet.model';
import {progressStatuses} from '../../../shared/symbols/statuses.symbols';

@Component({
  selector: 'app-rt-wallet-auth-root',
  templateUrl: './rt-wallet-auth-login.component.html',
  styleUrls: ['./rt-wallet-auth-login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RtWalletAuthLoginComponent implements OnInit, OnDestroy {
  @Select(RtWalletState.connectWalletStatus) public connectWalletStatus$: Observable<RtWalletStateModel['connectWalletStatus']>;
  @Select(RtWalletState.connectWalletError) public connectWalletError$: Observable<RtWalletStateModel['connectWalletError']>;

  /** Available statuses for common progress processes. */
  public readonly progressStatuses = progressStatuses;

  /** List of the component subscriptions. */
  private readonly subscription = new Subscription();

  constructor(private store: Store, private router: Router) {
  }

  ngOnInit(): void {
    // Navigate to the dashboard on the successful wallet connection.
    this.subscription.add(
      this.connectWalletStatus$.pipe(filter(status => status === progressStatuses.succeed)).subscribe(() => {
        this.router.navigate(['/dashboard']);
      }),
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  /**
   * Login with the Phantom wallet.
   */
  public loginWithPhantom(): void {
    this.store.dispatch(new ConnectPhantomWallet());
  }

}
