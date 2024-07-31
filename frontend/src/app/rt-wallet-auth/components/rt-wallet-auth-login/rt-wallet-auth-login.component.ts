import {filter, Subscription} from 'rxjs';
import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Store} from '@ngxs/store';
import {ConnectWallet} from '../../../rt-wallet/states/rt-wallet/rt-wallet.actions';
import {RtWalletState} from '../../../rt-wallet/states/rt-wallet/rt-wallet.state';
import {progressStatuses} from '../../../shared/symbols/statuses.symbols';

@Component({
  selector: 'app-rt-wallet-auth-root',
  templateUrl: './rt-wallet-auth-login.component.html',
  styleUrls: ['./rt-wallet-auth-login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RtWalletAuthLoginComponent implements OnInit, OnDestroy {
  public readonly connectWalletStatus$ = this.store.select(RtWalletState.connectWalletStatus);
  public readonly connectWalletError$ = this.store.select(RtWalletState.connectWalletError);

  /** Available statuses for common progress processes. */
  public readonly progressStatuses = progressStatuses;

  /** List of the component subscriptions. */
  private readonly subscription = new Subscription();

  constructor(
    private store: Store,
    private router: Router,
  ) {}

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
   * Login with the wallet.
   */
  public loginWithWallet(): void {
    this.store.dispatch(new ConnectWallet());
  }
}
