import {catchError, from, map, Observable} from 'rxjs';
import {inject, Injectable} from '@angular/core';
import {CanActivateFn, Router} from '@angular/router';
import {WalletReadyState} from '@solana/wallet-adapter-base';
import {currentWalletAdapter} from '../../shared/symbols/solana.symbols';

/**
 * The guard allows access to the route if the wallet is connected.
 */
@Injectable()
export class RtWalletPermissionsService {

  constructor(private router: Router) {
  }

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    // Allow access to the route if the wallet is connected.
    if (currentWalletAdapter.connected) {
      return true;
    } else if (currentWalletAdapter.readyState !== WalletReadyState.Installed) {
      // Redirect to the login page if the wallet is not installed.
      return this.router.navigate(['/auth/login']);
    }

    // Otherwise, try to connect to the wallet.
    return from(currentWalletAdapter.connect())
      .pipe(// Connected successfully => allow access to the route.
        map(() => true),

        // Failed to connect => redirect to the login page.
        catchError(() => this.router.navigate(['/auth/login'])));

  }
}

/**
 * The guard allows access to the route if the wallet is connected.
 */
export const rtWalletConnectedGuard: CanActivateFn = (): boolean | Observable<boolean> | Promise<boolean> =>
  inject(RtWalletPermissionsService).canActivate();
