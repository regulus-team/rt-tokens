import {catchError, from, map, Observable} from 'rxjs';
import {inject, Injectable} from '@angular/core';
import {CanActivateFn, Router} from '@angular/router';
import {WalletReadyState} from '@solana/wallet-adapter-base';
import {phantomWalletAdapter} from '../../shared/symbols/solana.symbols';

/**
 * The guard allows access to the route if the Phantom wallet is connected.
 */
@Injectable()
export class RtWalletPermissionsService {
  /**
   * Phantom wallet adapter.
   * Used for working with the Phantom wallet.
   */
  private readonly phantomWalletAdapter = phantomWalletAdapter;

  constructor(private router: Router) {
  }

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    // Allow access to the route if the Phantom wallet is connected.
    if (this.phantomWalletAdapter.connected) {
      return true;
    } else if (this.phantomWalletAdapter.readyState !== WalletReadyState.Installed) {
      // Redirect to the login page if the Phantom wallet is not installed.
      return this.router.navigate(['/auth/login']);
    }

    // Otherwise, try to connect to the Phantom wallet.
    return from(this.phantomWalletAdapter.connect())
      .pipe(// Connected successfully => allow access to the route.
        map(() => true),

        // Failed to connect => redirect to the login page.
        catchError(() => this.router.navigate(['/auth/login'])));

  }
}

/**
 * The guard allows access to the route if the Phantom wallet is connected.
 */
export const rtWalletConnectedGuard: CanActivateFn = (): boolean | Observable<boolean> | Promise<boolean> =>
  inject(RtWalletPermissionsService).canActivate();
