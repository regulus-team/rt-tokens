import {catchError, from, map, Observable} from 'rxjs';
import {inject, Injectable} from '@angular/core';
import {CanActivateFn, Router} from '@angular/router';
import {WalletReadyState} from '@solana/wallet-adapter-base';
import {RtSolanaService} from '../../rt-solana/services/rt-solana/rt-solana.service';

/**
 * The guard allows access to the route if the wallet is connected.
 */
@Injectable()
export class RtWalletPermissionsService {
  /**
   * The current wallet adapter.
   * Used for all wallet-related operations.
   */
  public readonly currentWalletAdapter = this.rtSolana.currentWalletAdapter;

  constructor(
    private router: Router,
    private rtSolana: RtSolanaService,
  ) {}

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    // Allow access to the route if the wallet is connected.
    if (this.currentWalletAdapter.connected) {
      return true;
    } else if (this.currentWalletAdapter.readyState !== WalletReadyState.Installed) {
      // Redirect to the login page if the wallet is not installed.
      return this.router.navigate(['/auth/login']);
    }

    // Otherwise, try to connect to the wallet.
    return from(this.currentWalletAdapter.connect()).pipe(
      // Connected successfully => allow access to the route.
      map(() => true),

      // Failed to connect => redirect to the login page.
      catchError(() => this.router.navigate(['/auth/login'])),
    );
  }
}

/**
 * The guard allows access to the route if the wallet is connected.
 */
export const rtWalletConnectedGuard: CanActivateFn = (): boolean | Observable<boolean> | Promise<boolean> =>
  inject(RtWalletPermissionsService).canActivate();
